
const highlightHashPrefix = '#:~~:pos=';


function scrollInContent() {

  let hash = window.location.hash;

  if (!hash ||
      !hash.startsWith(highlightHashPrefix)) return;

  hash = hash.slice(highlightHashPrefix.length);

  if (hash.length === 0) return;

  hash = Number(hash);

  if (isNaN(hash)) return;


  // prevent automatic browser scroll restoration
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  
  
  window.scroll({
    top: hash
  });
  
}

scrollInContent();



// update icon dark mode

// send dark/light mode message to background script
// to update icon

const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

darkModeQuery.addEventListener('change', e => {
    
  chrome.runtime.sendMessage({ isDarkMode: e.matches });
  
});

// send initial update
chrome.runtime.sendMessage({ isDarkMode: darkModeQuery.matches });
