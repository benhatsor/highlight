browser.webNavigation.onDOMContentLoaded.addListener(function(details) {
  browser.tabs.executeScript({null,
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
