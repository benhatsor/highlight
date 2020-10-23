const isFirefox = window.browser && browser.runtime;
const theBrowser = isFirefox ? browser : chrome;

theBrowser.tabs.onUpdated.addListener(function() {  
  theBrowser.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

theBrowser.tabs.onActivated.addListener(function() {
  theBrowser.browserAction.setIcon({path: 'icon.png'});
})

function scrollInContent() {
  var hash = window.location.hash.replace('#', '');
  
  if (!isNaN(hash)) {
    window.scroll({top: Number(hash) })
  }
}