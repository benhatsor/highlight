browser.tabs.onUpdated.addListener(function() {  
  browser.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

browser.tabs.onActivated.addListener(function() {
  browser.browserAction.setIcon({path: 'icon.png'});
})

function scrollInContent() {
  var hash = window.location.hash.replace('#', '');
  
  if (hash && !isNaN(hash)) {
    window.scroll({top: Number(hash) })
  }
}