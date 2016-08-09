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
  iframe.src = 'https://staging-fullpm.wiredcraft.net/boards/' + queryObj.name + '/' + queryObj.repo;
  iframe.style.cssText = 'width:100%;height:100%;border:none';

  return iframe
};

var iframe = generateIframe(getJsonFromUrl())
var kanban = document.getElementById('kanban')
kanban.appendChild(iframe)
