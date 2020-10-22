chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

function scrollInContent() {
  var url = new URL(window.location.href);
  var scroll = url.searchParams.get('scroll');
  if (scroll) {
    window.scroll({top:Number(scroll)})
  }
}
