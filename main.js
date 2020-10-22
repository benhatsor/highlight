chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({
    code: `(${ inContent })()`
  }, ([result] = []) => {
    if (!chrome.runtime.lastError) {
      chrome.bookmarks.create({'parentId': bookmarkBar.id, 'title': result.title, 'url': result.url+'?scroll='+scrollPos });
    }
  });
});

browser.webNavigation.onDOMContentLoaded.addListener(function(details) {
  browser.tabs.executeScript({
    code: `(${ scrollInContent })()`
  });
})

function inContent() {
  return {
    success: true,
    title: document.title,
    url: window.location.href,
    scrollPos: window.scrollY || window.pageYOffset
  };
}


function scrollInContent() {
  var url = new URL(window.location.href);
  var scroll = url.searchParams.get('scroll');
  if (scroll) {
    window.scroll({top:Number(scroll)})
  }
}
