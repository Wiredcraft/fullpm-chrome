var iframe
var contentHeight // header + footer only height
var userOnline = null // null === not yet known

// Append board button to page
function appendButtonToNav () {
  // Stop if button exists already
  if (document.getElementById('fpmButton')) { return null }

  navElem = document.getElementsByClassName('js-repo-nav')[0]
  if (navElem) {
    aEl = document.createElement('a');
    aEl.addEventListener('click', appendContentToPage)
    aEl.text = 'Board';
    aEl.id = 'fpmButton';
    aEl.href = '#board';
    aEl.classList = ['js-selected-navigation-item reponav-item']
    navElem.appendChild(aEl)
  }
}

// Resize iframe to fit height
function resize () {
  var pageHeight = window.document.documentElement.clientHeight;
  var iframeHeight = pageHeight - contentHeight - 5; // -5 extra padding/margin
  iframe.style.cssText = 'width:100%;height:' + iframeHeight  + 'px;border:none;position:absolute;left:0;';
}

// Replace content with board
function appendContentToPage () {
  // Do not append content until onlineStatus is known
  if (userOnline === null) return setTimeout(appendContentToPage, 1000)
  // Not logged in, request login
  if (userOnline === false) return requestLogin()

  // Get current user/org name & repo name
  var pathArray = window.location.pathname.replace('/', '').split('/')
  var name = pathArray[0]
  var repo = pathArray[1]
  var queryString = '?name=' + encodeURIComponent(name) + '&repo=' + encodeURIComponent(repo)

  // Remove GitHub body content
  contentElem = document.getElementsByClassName('repository-content')[0]
  while (contentElem.firstChild) {
    contentElem.removeChild(contentElem.firstChild);
  }

  // Remove GitHub Footer
  pageFooter = document.getElementsByClassName('site-footer-container')[0]
  while (pageFooter.firstChild) {
    pageFooter.removeChild(pageFooter.firstChild)
  }

  // Zero-out uneeded margins
  pageHeader = document.getElementsByClassName('pagehead')[0]
  if (pageHeader) {
    pageHeader.style.cssText = 'margin-bottom:0;'
  }

  // Set content height (as only header is left on page now)
  contentHeight = document.body.clientHeight;

  // Calculate height for iframe (viewport minus contentHeight)
  var pageHeight = document.documentElement.clientHeight;
  var iframeHeight = pageHeight - contentHeight - 5; // -5 extra padding/margin

  // Create our content
  iframe = document.createElement('iframe');
  iframe.id = 'fpmContainer'
  iframe.src = chrome.runtime.getURL('frame/index.html' + queryString);
  iframe.style.cssText = 'width:100%;height:' + iframeHeight + 'px;border:none;position:absolute;left:0;';

  // Append our content to the content element
  contentElem.appendChild(iframe)

  // Our link should be selected now
  var activeLinkEl = document.getElementsByClassName('selected reponav-item')[0]
  activeLinkEl.classList.remove("selected")
  document.getElementById('fpmButton').classList.add('selected')

  window.onresize = resize
}

function requestLogin () {
  chrome.runtime.sendMessage({ type: 'loginRedirect' })
}

function updateUserOnline () {
  chrome.runtime.sendMessage({ type: 'requestStatus'}, function (res) {
    if (res.status === true) userOnline = true
    else userOnline = false
  })
}

// Background script message listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case 'complete': // GitHub AJAX page updates complete, ensure kanban button is still appended to tabs
      updateUserOnline()
      appendButtonToNav()
      if (window.location.hash === '#board') appendContentToPage() // If #board is in url on github page, open our tab
      break
    default:
      console.info('Unexpected message received:', request, sender)
      break
  }
})

// Append button on load
updateUserOnline()
appendButtonToNav()
