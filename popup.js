document.getElementById('save').addEventListener('click', () => {
  const disability = document.getElementById('disability').value;

  chrome.storage.sync.set({ userDisability: disability }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;

      chrome.tabs.sendMessage(tabId, { action: 'updateAccessibility', disability: disability }, () => {
        chrome.tabs.reload(tabId);
      });
    });

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

document.addEventListener('DOMContentLoaded', function() {
  // Click detection toggle
  const toggleDetection = document.getElementById('toggleDetection');

  // Restore click detection state from storage
  chrome.storage.sync.get(['detectionEnabled'], function(result) {
    const isEnabled = result.detectionEnabled || false;
    toggleDetection.checked = isEnabled;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleClickDetection,
        args: [isEnabled]
      });
    });
  });

  // Handle click detection toggle changes
  toggleDetection.addEventListener('change', function() {
    const isEnabled = toggleDetection.checked;

    chrome.storage.sync.set({ 'detectionEnabled': isEnabled }, function() {
      console.log('Starea toggle-ului a fost salvată:', isEnabled);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleClickDetection,
        args: [isEnabled]
      });
    });
  });

  // Cursor outline toggle
  const toggleCursorOutline = document.getElementById('toggleCursorOutline');

  // Restore cursor outline state from storage
  chrome.storage.sync.get(['cursorOutlineEnabled'], function(result) {
    const isEnabled = result.cursorOutlineEnabled || false;
    toggleCursorOutline.checked = isEnabled;

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleCursorOutlineFunc,
        args: [isEnabled]
      });
    });
  });

  // Handle cursor outline toggle changes
  toggleCursorOutline.addEventListener('change', function() {
    const isEnabled = toggleCursorOutline.checked;

    chrome.storage.sync.set({ 'cursorOutlineEnabled': isEnabled }, function() {
      console.log('Cursor outline state saved:', isEnabled);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: toggleCursorOutlineFunc,
        args: [isEnabled]
      });
    });
  });
});

// Function injected for click detection
function toggleClickDetection(isEnabled) {
  const detectClicks = function(event) {
    if (!window.clickPositions) {
      window.clickPositions = [];
    }

    const x = event.clientX;
    const y = event.clientY;

    if (window.clickPositions.length > 0) {
      const lastClick = window.clickPositions[window.clickPositions.length - 1];
      const isSameSpot = Math.abs(lastClick.x - x) <= 5 && Math.abs(lastClick.y - y) <= 5;

      if (isSameSpot) {
        window.clickPositions.push({ x, y });
      } else {
        window.clickPositions = [{ x, y }];
      }
    } else {
      window.clickPositions.push({ x, y });
    }

    if (window.clickPositions.length >= 5) {
      alert('Ai apasat de prea multe ori in acelasi loc pe pagina!');
      window.clickPositions = [];
    }

    console.log(`Clic la (${x}, ${y}), total: ${window.clickPositions.length}`);
  };

  if (isEnabled) {
    if (window.clickListener) {
      document.removeEventListener('click', window.clickListener);
    }
    if (!window.isClickDetectionActive) {
      window.clickListener = detectClicks;
      document.addEventListener('click', window.clickListener);
      window.isClickDetectionActive = true;
      console.log('Detectarea clicurilor activată');
    }
  } else {
    if (window.clickListener && window.isClickDetectionActive) {
      document.removeEventListener('click', window.clickListener);
      window.clickListener = null;
      window.clickPositions = [];
      window.isClickDetectionActive = false;
      console.log('Detectarea clicurilor dezactivată');
    }
  }
}

// Function injected for cursor outline
function toggleCursorOutlineFunc(isEnabled) {
  const existingOutline = document.getElementById('cursor-outline');
  if (existingOutline) {
    existingOutline.remove();
  }
  if (window.cursorMoveListener) {
    document.removeEventListener('mousemove', window.cursorMoveListener);
    window.cursorMoveListener = null;
  }

  if (isEnabled) {
    const outline = document.createElement('div');
    outline.id = 'cursor-outline';
    outline.style.position = 'absolute';
    outline.style.border = '6px solid red';
    outline.style.borderRadius = '50%';
    outline.style.width = '30px';
    outline.style.height = '30px';
    outline.style.pointerEvents = 'none';
    outline.style.zIndex = '9999';
    outline.style.transform = 'translate(-50%, -50%)'; // Center the element
    document.body.appendChild(outline);

    window.cursorMoveListener = function(event) {
      const x = event.pageX; // Use pageX instead of clientX for better positioning
      const y = event.pageY; // Use pageY instead of clientY
      outline.style.left = x + 'px'; // Position at cursor tip
      outline.style.top = y + 'px';
    };

    document.addEventListener('mousemove', window.cursorMoveListener);
    console.log('Cursor outline enabled');
  } else {
    console.log('Cursor outline disabled');
  }
}