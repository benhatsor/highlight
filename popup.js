chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({null,
    code: `(${ inContent })()`
  }, ([result] = []) => {
    if (!chrome.runtime.lastError) {
      chrome.bookmarks.create({'parentId': bookmarkBar.id, 'title': result.title, 'url': result.url+'?scroll='+scrollPos });
    }
  });
});

function inContent() {
  return {
    success: true,
    title: document.title,
    url: window.location.href,
    scrollPos: window.scrollY || window.pageYOffset
  };
}
