var ttURL = 'http://127.0.0.1:5000/'

chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
  summarize(tabs[0].url);
});

function summarize(url) {
  console.log(url)

  var xhr = new XMLHttpRequest();
  xhr.open("GET", ttURL + "summarize?url=" + url, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var res = JSON.parse(xhr.responseText);
    }
  }

  xhr.send()
}

// var xhr = new XMLHttpRequest();
// var response = null
// var defaultCount = 5

// xhr.open("GET", "http://127.0.0.1:5000/get/276", true);

// xhr.onreadystatechange = function() {
//   if (xhr.readyState == 4) {
//     // innerText does not let the attacker inject HTML elements.
//     // document.getElementById("content").innerText = xhr.responseText;

//     var res = JSON.parse(xhr.responseText);
//     response = res;

//     showSentences(defaultCount);
//   }
// }

// xhr.send();

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

// function showRangeSlider(count) {
//   var range = document.createElement('input');
//   range.id = 'sentencesRange'
//   range.type = 'range';
//   range.min = 1
//   range.max = response['sentences'].length;
//   range.step = 1
//   range.value = count

//   document.getElementById("content").appendChild(range);

//   range.onchange = function() {
//     showSentences(range.value)
//   }
// }

// function sortScore(a, b) {
//   if(a.score < b.score)
//     return -1;

//   if(a.score > b.score)
//     return 1

//   return 0;
// }

// function sortOrder(a, b) {
//   if(a.order < b.order)
//     return -1;

//   if(a.order > b.order)
//     return 1

//   return 0;
// }