// Append kanban button to page
function appendButtonToNav () {
  // Stop if button exists already
  if (document.getElementById('kenhq')) { return null }

  navElem = document.getElementsByClassName('js-repo-nav')[0]
  if (navElem) {
    aEl = document.createElement('a');
    aEl.addEventListener('click', appendContentToPage)
    aEl.text = 'Kanban';
    aEl.id = 'kenhq';
    aEl.href = '#kenhq';
    aEl.classList = ['js-selected-navigation-item reponav-item']
    navElem.appendChild(aEl)
  }
}

var pageHeight = document.documentElement.clientHeight;

function appendContentToPage () {
  // Get current user/org name & repo name
  var pathArray = window.location.pathname.replace('/', '').split('/')
  var name = pathArray[0]
  var repo = pathArray[1]
  var queryString = '?name=' + encodeURIComponent(name) + '&repo=' + encodeURIComponent(repo)

  // Tab content element
  contentElem = document.getElementsByClassName('repository-content')[0]

  // Create our content
  var iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('frame/index.html' + queryString);
  iframe.style.cssText = 'width:100%;height:500px;border:none';

  // Clear contentElem for our content
  while (contentElem.firstChild) {
    contentElem.removeChild(contentElem.firstChild);
  }

  // Append our content to the content element
  contentElem.appendChild(iframe)

  // Our link should be selected now
  var activeLinkEl = document.getElementsByClassName('selected reponav-item')[0]
  activeLinkEl.classList.remove("selected")
  this.classList.add('selected')
}

// Background script message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'complete':
      appendButtonToNav()
      break
    default:
      console.info('Unexpected message received:', request, sender)
      break
  }
})

// Append button on load
appendButtonToNav()
