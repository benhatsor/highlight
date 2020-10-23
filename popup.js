var destFolder, bookmarkBar, pageData;

function inContent() {
    return {
        title: window.location.hostname,
        url: window.location.href,
        scrollPos: window.scrollY || window.pageYOffset
    };
}

function select(node) {
    node.focus();
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function toggleBookmark() {
  browser.bookmarks.create({
    title: pageData.title,
    url: pageData.url+'#'+pageData.scrollPos
  });
}

browser.tabs.executeScript({
    code: `(${ inContent })()`
}, ([result] = []) => {
    if (!browser.runtime.lastError) {
		pageData = result;
		
		document.querySelector('.title').innerHTML = pageData.title;
		document.querySelector('.url').innerHTML = pageData.url;
		select(document.querySelector('.title'));
		
		document.querySelector('.save').addEventListener('click', e => {
		  pageData.title = document.querySelector('.title').innerHTML;
		  toggleBookmark();
		  window.close();
		})
		
		document.querySelector('.cancel').addEventListener('click', e => {
		  browser.browserAction.setIcon({path: 'icon.png'}, function() {
		    window.close();
		  });
		})
    }
});

browser.browserAction.setIcon({path: 'icon-on.png'});