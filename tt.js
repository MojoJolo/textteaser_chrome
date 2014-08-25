var ttURL = 'http://127.0.0.1:5000/'
var summary = ''
var defaultCount = 2

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
  summarize(tabs[0].url);
});

function summarize(url) {
  console.log('Summarizing this url: ' + url)

  $.get(ttURL + "summarize", {url: url}, "json")
    .done(function(data) {
      summary = data
      showSentences(defaultCount)
    })
    .fail(function(data) {
      checkSummary(data.responseJSON.id)
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

  sentences =  summary.sentences
  sentences.sort(sortScore).reverse();
  sentences = sentences.slice(0, count)
  sentences.sort(sortOrder)

  var ul = $('<ul></ul>')

  $.each(sentences, function(i, sentence) {
    ul.append($('<li></li>').append(sentence.sentence))
  });

  $('#content').append(ul);
}

// function showSentences(count) {
//   console.log(tabURL)
//   document.getElementById("content").innerText = ''
  
//   showRangeSlider(count);

//   sentences = response['sentences'];
//   sentences.sort(sortScore).reverse();
//   sentences = sentences.slice(0, count)
//   sentences.sort(sortOrder)

//   var ul = document.createElement('ul');

//   for(var i in sentences) {
//     var li = document.createElement('li');
//     li.appendChild(document.createTextNode(sentences[i].sentence));
//     ul.appendChild(li)
//   }

//   document.getElementById("content").appendChild(ul);
// }

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