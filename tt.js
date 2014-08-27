var ttURL = 'http://127.0.0.1:5000/'
var summary = ''
var defaultCount = 5
var view = 0

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
  summarize(tabs[0].url);
});

function summarize(url) {
  console.log('Summarizing this url: ' + url)

  $.get(ttURL + "summarize", {url: url}, "json")
    .done(function(data) {
      if(data.sentences == null)
        checkSummary(data.id)
      else {
        console.log(data)
        summary = data
        showSentences(defaultCount)
      }
    })
    .fail(function(data) {
      if(data.responseJSON.error == 'summary not done yet')
        checkSummary(data.responseJSON.id)
      else
        console.log(data.responseJSON.error)
    });
}

function checkSummary(summid) {
  console.log('Checking if the summary is ready...')

  $.get(ttURL + 'get/' + summid, "json")
    .done(function(data) {
      summary = data
      showSentences(defaultCount)
    })
    .fail(function(data) {
      setTimeout(function() {
        checkSummary(summid)
      }, 2000);
    })
}

function showSentences(count) {
  console.log('Adding ' + count + ' sentences in the popup...')

  $('#content').empty()
  showRangeSlider(count);
  toggleView(count);

  sentences =  summary.sentences
  sentences.sort(sortScore).reverse();
  sentences = sentences.slice(0, count)
  sentences.sort(sortOrder)

  var textContent = $('<div></div>').attr({
    id: 'textContent'
  });

  if(view == 0) {
    var ul = $('<ul></ul>')

    $.each(sentences, function(i, sentence) {
      var li = $('<li></li>').attr({
        id: 'sentenceList'
      });

      li.append(sentence.sentence)

      ul.append(li)
    });

    textContent.append(ul);
  }
  else {
    var p = $('<p></p>').attr({
      id: 'paragraph'
    });

    $.each(sentences, function(i, sentence) {
      p.append(sentence.sentence + ' ')

      if(i != 0 && i % 3 == 0)
        p.append('<br><br>')
    });

    textContent.append(p);
  }

  $('#content').append('<br>');
  $('#content').append(textContent);

  showFooter();
}

function toggleView(count) {
  var listView = $('<a>list</a>').attr({
    href: "#"
  }).click(function() {
    view = 0;
    showSentences(count);
  });

  var paragView = $('<a>paragraph</a>').attr({
    href: "#"
  }).click(function() {
    view = 1;
    showSentences(count);
  });

  var views = $('<div>View as: </div>').attr({
    id: 'views'
  });

  views.append(listView);
  views.append(' | ');
  views.append(paragView);

  $('#content').append(views);
}

function showFooter() {
  var footer = $('<footer>Summary by </footer>').attr({
    id: 'footer'
  });

  var logo = $('<a>TextTeaser</a>').attr({
    id: 'logo',
    href: 'http://www.textteaser.com/'
  });

  footer.append(logo);
  $('#content').append(footer);
}

function showRangeSlider(count) {
  var range = $('<input>').attr({
    id: 'sentencesRange',
    type: 'range',
    min: 1,
    max: summary.sentences.length,
    step: 1,
    value: count
  }).change(function() {
    showSentences($(this).val());
  });

  $('#content').append(range);
}

function sortScore(a, b) {
  if(a.score < b.score)
    return -1;

  if(a.score > b.score)
    return 1

  return 0;
}

function sortOrder(a, b) {
  if(a.order < b.order)
    return -1;

  if(a.order > b.order)
    return 1

  return 0;
}