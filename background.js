chrome.tabs.onUpdated.addListener(function() {  
  chrome.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

chrome.tabs.onActivated.addListener(function() {
  chrome.browserAction.setIcon({path: 'icon.png'});
})

function scrollInContent() {
  var hash = window.location.hash.replace('#', '');
  
  if (!isNaN(hash)) {
    window.scroll({top: Number(hash) })
  }
}