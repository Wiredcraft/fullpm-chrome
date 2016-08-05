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
  iframe.src = 'https://staging-kenhq.wiredcraft.net/boards/' + queryObj.name + '/' + queryObj.repo;
  iframe.style.cssText = 'width:100%;height:400px;border:none';

  return iframe
};

var iframe = generateIframe(getJsonFromUrl())
var kanban = document.getElementById('kanban')
kanban.appendChild(iframe)

console.info('Iframe injected for:', iframe.src)
