document.getElementById('save').addEventListener('click', () => {
    const disability = document.getElementById('disability').value;
    chrome.storage.sync.set({ userDisability: disability }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'updateAccessibility', disability: disability });
      });
      alert('Settings saved!');
      updateVisionControls(disability);
    });
  });
  
  // Show/hide vision-specific controls
  function updateVisionControls(disability) {
    const visionControls = document.getElementById('vision-controls');
    visionControls.style.display = disability === 'vision' ? 'block' : 'none';
  }
  
  // Load current setting on popup open
  chrome.storage.sync.get(['userDisability'], (result) => {
    const disability = result.userDisability || 'none';
    document.getElementById('disability').value = disability;
    updateVisionControls(disability);
  });
  
  // Vision control buttons
  document.getElementById('read').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => window.getSelection().toString()
      }, (results) => {
        if (results && results[0].result) {
          const selectedText = results[0].result;
          if (selectedText) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'speakText', text: selectedText });
          }
        }
      });
    });
  });
  
  document.getElementById('toggle-contrast').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleContrast' });
    });
  });
  
  document.getElementById('toggle-zoom').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleZoom' });
    });
  });