var pageData;

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
    url: pageData.url + '#' + Math.round(pageData.scrollPos)
  });
}

browser.tabs.executeScript({
  code: `(${ inContent })()`
}, ([result] = []) => {
  if (!browser.runtime.lastError) {
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
      toggleBookmark();
      window.close();
    })

    document.querySelector('.cancel').addEventListener('click', e => {
      window.close();
    })
  }
});