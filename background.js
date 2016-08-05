// Detect url changes here and message tab to update
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { type: changeInfo.status }, function(response) {
      if (!response) return false
      console.info('Unexpected message response:', response)
    })
  }
})
