
const highlightHashPrefix = '#:~~:pos=';


var destFolder, pageData;

function inContent() {
  var body = document.body,
    html = document.documentElement;

  var height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);

  return {
    title: window.location.hostname,
    url: window.location.href.split('#')[0],
    scrollPos: window.scrollY || window.pageYOffset,
    pageHeight: height
  };
}

function findOrCreateDestinationFolder(rootNodes) {
  createBookmark(pageData);
}

function createBookmark(result) {
  chrome.bookmarks.create({
    'title': result.title,
    'url': (result.url + highlightHashPrefix + Math.round(result.scrollPos))
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

async function main() {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  let result;
  
  try {
    
    result = await chrome.scripting.executeScript({
      func: inContent,
      target: { tabId: tab.id }
    });
    
  } catch(e) {
    return;
  }
  
  if (!result) return;
  
  result = result[0]?.result;
  
  if (!result) return;
  
  
  pageData = result;

  var scrollPos = pageData.scrollPos;
  var fourth = pageData.pageHeight / 4;
  var place = '';
  if (scrollPos > 0 && scrollPos < fourth) {
    place = ' - near top';
  } else if (scrollPos > fourth && scrollPos < (fourth * 2)) {
    place = ' - near middle';
  } else if (scrollPos > (fourth * 2) && scrollPos < (fourth * 3)) {
    place = ' - near middle';
  } else if (scrollPos > (fourth * 3) && scrollPos < pageData.pageHeight) {
    place = ' - near bottom';
  } else if (scrollPos == pageData.pageHeight) {
    place = ' - bottom';
  }

  document.querySelector('.title').innerHTML = pageData.title + place;
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

main();



// update icon dark mode

// send dark/light mode message to background script
// to update icon

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeQuery.addEventListener('change', e => {
    
  chrome.runtime.sendMessage({ isDarkMode: e.matches });
  
});

// send initial update
chrome.runtime.sendMessage({ isDarkMode: darkModeQuery.matches });
