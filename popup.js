var destFolder, bookmarkBar, pageData;

function inContent() {
    return {
        title: window.location.hostname,
        url: window.location.href.split('#')[0],
        scrollPos: window.scrollY || window.pageYOffset
    };
}

function findOrCreateDestinationFolder(rootNodes) {
	createBookmark(pageData);
}

function createBookmark(result) {
	chrome.bookmarks.create({
		'title': result.title,
		'url': (result.url + '#' + Math.round(result.scrollPos))
	});
}

function findBookmarksFolder(rootNode, searchString) {
    if (rootNode.url) {
        return null;
    } else if (rootNode.title.indexOf(searchString) >= 0) {
        return rootNode;
    }
    for (var i = 0; i < rootNode.children.length; i++) {
        var dest = findBookmarksFolder(rootNode.children[i], searchString);
        if (dest) {
            return dest;
        }
    }
    return null;
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

chrome.tabs.executeScript({
    code: `(${ inContent })()`
}, ([result] = []) => {
    if (!chrome.runtime.lastError) {
		pageData = result;
		
		document.querySelector('.title').innerHTML = pageData.title;
		document.querySelector('.url').innerHTML = pageData.url;
		select(document.querySelector('.title'));
		
		document.querySelector('.save').addEventListener('click', e => {
		  pageData.title = document.querySelector('.title').innerHTML;
		  
		  chrome.bookmarks.getTree(findOrCreateDestinationFolder);
		  window.close();
		})
		
		document.querySelector('.cancel').addEventListener('click', e => {
		  chrome.browserAction.setIcon({path: 'icon.png'}, function() {
		    window.close();
		  });
		})
    }
});


chrome.browserAction.setIcon({path: 'icon-on.png'});