var iframe
var contentHeight // header + footer only height

// Append kanban button to page
function appendButtonToNav () {
  // Stop if button exists already
  if (document.getElementById('fullpm')) { return null }

  navElem = document.getElementsByClassName('js-repo-nav')[0]
  if (navElem) {
    aEl = document.createElement('a');
    aEl.addEventListener('click', appendContentToPage)
    aEl.text = 'Board';
    aEl.id = 'fullpm';
    aEl.href = '#fullpm';
    aEl.classList = ['js-selected-navigation-item reponav-item']
    navElem.appendChild(aEl)
  }
}

// Resize iframe to fit height
function resize () {
  var pageHeight = window.document.documentElement.clientHeight;
  var iframeHeight = pageHeight - contentHeight - 5; // -5 extra padding/margin
  iframe.style.cssText = 'width:100%;height:' + iframeHeight  + 'px;border:none';
}

// Replace content with kanban
function appendContentToPage () {
  // Get current user/org name & repo name
  var pathArray = window.location.pathname.replace('/', '').split('/')
  var name = pathArray[0]
  var repo = pathArray[1]
  var queryString = '?name=' + encodeURIComponent(name) + '&repo=' + encodeURIComponent(repo)

  // Tab content element
  contentElem = document.getElementsByClassName('repository-content')[0]

  // Clear contentElem for our content
  while (contentElem.firstChild) {
    contentElem.removeChild(contentElem.firstChild);
  }

  // Set content height (as only header & footer are left on page now)
  contentHeight = document.body.clientHeight;

  // Calculate height for iframe
  var pageHeight = document.documentElement.clientHeight;
  var iframeHeight = pageHeight - contentHeight - 5; // -5 extra padding/margin

  // Create our content
  iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('frame/index.html' + queryString);
  iframe.style.cssText = 'width:100%;height:' + iframeHeight + 'px;border:none';

  // Append our content to the content element
  contentElem.appendChild(iframe)

  // Our link should be selected now
  var activeLinkEl = document.getElementsByClassName('selected reponav-item')[0]
  activeLinkEl.classList.remove("selected")
  this.classList.add('selected')

  window.onresize = resize
}

// Background script message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'complete': // GitHub AJAX page updates complete, ensure kanban button is still appended to tabs
      appendButtonToNav()
      break
    default:
      console.info('Unexpected message received:', request, sender)
      break
  }
})

// Append button on load
appendButtonToNav()
