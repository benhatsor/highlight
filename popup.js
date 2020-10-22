chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript({null,
    code: `(${ inContent })()`
  }, ([result] = []) => {
    if (!chrome.runtime.lastError) {
      chrome.bookmarks.create({'parentId': bookmarkBar.id, 'title': result.title, 'url': result.url+'?scroll='+scrollPos });
    }
  });
});
