// Parse the querystring
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = item[1];
  });
  return result;
};

function generateIframe(queryObj) {
  var iframe = document.createElement('iframe')

  var iframe = document.createElement('iframe');
  iframe.id = 'fullpmIframe'
  iframe.src = 'https://staging-fullpm.wiredcraft.net/boards/' + queryObj.name + '/' + queryObj.repo;
  iframe.style.cssText = 'width:1110px;height:100%;border:none;margin:0 auto;display:block;';

  iframe.onload = function () {
    // Timeout to allow time for fullpm webpage in iframe to render it's
    // own loading spinner. Prevents a flash of nothing being shown
    // The time value may need further adjustment
    setTimeout(function () {
      document.getElementById('loader').classList.add('hidden')
    }, 1000)
  }

  return iframe
};

var iframe = generateIframe(getJsonFromUrl())
var fullpm = document.getElementById('fullpm')
fullpm.appendChild(iframe)
// document.getElementById('fullpmIframe').onload = function ()
