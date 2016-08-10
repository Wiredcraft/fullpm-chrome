// Detect url changes here and message tab to update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: changeInfo.status }, function(response) {
      if (!response) return false
      console.info('Unexpected message response:', response)
    })
  }
})

// Listen for messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch(request.type) {
    case 'requestStatus':
      return handleStatusRequest(request, sender, sendResponse)
    case 'loginRedirect':
      return handleLoginRedirectRequest(request, sender, sendResponse)
    default:
      return console.info('Unexpected message received:', request, sender)
  }
})

// Handle request for login redirect
function handleLoginRedirectRequest (request, sender, sendResponse) {
  let url = 'https://staging-fullpm.wiredcraft.net/auth/github?redirect=' + encodeURIComponent(sender.tab.url)
  chrome.tabs.update(sender.tab.id, { url: url });
}

// Handle request for login status
function handleStatusRequest (request, sender, sendResponse) {
  getLoggedInStatus()
    .then(function (res) {
      sendResponse({ type: 'receiveStatus', status: true });
    })
    .catch(function (err) {
      sendResponse({ type: 'receiveStatus', status: false });
    })
  return true // required for async sendResponse
}

// Request FullPM /user endpoint for logged in status
function getLoggedInStatus () {
  return new Promise(function (resolve, reject) {
    fetch('https://staging-fullpm.wiredcraft.net/auth/user', {
      credentials: 'include'
    }).then(function (res) {
        if (res.status !== 200) return reject(res.statusText)
        resolve(res.json())
      })
      .catch(function (err) {
        reject(err.statusText)
      })
  })
}
