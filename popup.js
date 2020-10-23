var destFolder, bookmarkBar, pageData;

function inContent() {
    return {
        title: document.title,
        url: window.location.href,
        scrollPos: window.scrollY || window.pageYOffset
    };
}

function findOrCreateDestinationFolder(rootNodes) {
    var rootNode;
    if (rootNodes.length > 0) {
        rootNode = rootNodes[0];
    }
    destFolder = findBookmarksFolder(rootNode, "Smart Bookmarks");
    if (!destFolder) {
        bookmarkBar = findBookmarksFolder(rootNode, "Other bookmarks");
        chrome.bookmarks.create({
            parentId: bookmarkBar ? bookmarkBar.id : "1",
            title: "Smart Bookmarks"
        }, function(bmk) {
            destFolder = bmk;
            createBookmark(pageData);
        });
    } else {
        createBookmark(pageData);
    }
}

function createBookmark(result) {
    if (destFolder) {
        chrome.bookmarks.create({
            'parentId': destFolder.id,
            'title': result.title,
            'url': (result.url + '?scroll=' + result.scrollPos)
        });
    }
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
		  window.close();
		})
    }
});