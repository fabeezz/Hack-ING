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

  async function sendBrightnessRequest(action) {
    try {
      const response = await fetch("http://localhost:5050/brightness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: action }),
      });
      const data = await response.json();
      if (data.status === "success") {
        document.getElementById(
          "status"
        ).textContent = `Status: Brightness set to ${data.brightness}%`;
      } else {
        document.getElementById(
          "status"
        ).textContent = `Status: Error - ${data.message}`;
      }
    } catch (error) {
      document.getElementById(
        "status"
      ).textContent = `Status: Failed to connect to server (${error.message})`;
    }
  }
  
  document.getElementById("brightnessUp").addEventListener("click", () => {
    sendBrightnessRequest("increase");
  });
  
  document.getElementById("brightnessDown").addEventListener("click", () => {
    sendBrightnessRequest("decrease");
  });
   