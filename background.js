
let oldIsDarkMode = false;

chrome.runtime.onMessage.addListener(function(request) {
  
  // ignore duplicate update messages
  if (request.isDarkMode === oldIsDarkMode) return;
  
  const iconSuffix = request.isDarkMode ? "-dark" : "";
  
  chrome.action.setIcon({
    path: {
      "96": `icon${iconSuffix}.png`
    }
  });
  
  oldIsDarkMode = request.isDarkMode;
  
});
