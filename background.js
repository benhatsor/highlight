browser.tabs.onUpdated.addListener(function() {
  browser.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

function scrollInContent() {
  var hash = window.location.hash.replace('#', '');

  if (hash && !isNaN(hash)) {
    window.scroll({
      top: Number(hash)
    })
  }
}

if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  browser.browserAction.setIcon({
    path: {
      "48": "icon-dark.png",
      "96": "icon-dark@2x.png"
    }
  });
}