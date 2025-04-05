// Function to apply accessibility changes
function applyAccessibility(disability) {
    console.log('Applying accessibility for:', disability);
    const existingStyle = document.getElementById('accessibility-style');
    if (existingStyle) existingStyle.remove();
  
    // Reset styles
    document.body.style.zoom = '';
    document.body.style.fontSize = '';
    document.body.style.backgroundColor = '';
    document.body.style.color = '';
    document.body.classList.remove('default-contrast', 'high-contrast');
  
    if (disability === 'vision') {
      const style = document.createElement('style');
      style.id = 'accessibility-style';
      style.textContent = `
        body {
          font-size: 36px !important;
          color: #000 !important;
          font-family: Arial, sans-serif !important;
          line-height: 1.8 !important;
          letter-spacing: 0.5px !important;
        }
        body.default-contrast {
          background-color: #fff !important;
        }
        body.high-contrast {
          background-color: #ff0 !important;
        }
        a, button, input, select {
          font-size: 36px !important;
          padding: 10px !important;
          border: 2px solid #000 !important;
          color: #000 !important;
        }
        body.default-contrast a, body.default-contrast button, body.default-contrast input, body.default-contrast select {
          background-color: #fff !important;
        }
        body.high-contrast a, body.high-contrast button, body.high-contrast input, body.high-contrast select {
          background-color: #ff0 !important;
        }
        img, video {
          display: none !important;
        }
        :hover {
          background-color: #e0e0e0 !important;
        }
        aside, .sidebar, .ad, [class*="ad"], [id*="ad"], nav:not(:first-child) {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('default-contrast');
      document.body.style.zoom = '150%';
  
      // Add key handler for 'r' to read text as a bonus feature
      document.removeEventListener('keydown', visionKeyHandler);
      document.addEventListener('keydown', visionKeyHandler);
      console.log('Vision settings applied');
    } else if (disability === 'motor') {
      document.removeEventListener('keydown', scrollHandler);
      document.addEventListener('keydown', scrollHandler);
      console.log('Motor settings applied');
    } else if (disability === 'colorblind') {
      const style = document.createElement('style');
      style.id = 'accessibility-style';
      style.textContent = 
        `<style>
  body {
    padding: 10px;
    width: 250px;
  }

  button {
    margin: 5px 0;
    padding: 5px;
    width: 100%;
    border: 2px solid #000 !important; /* Asigură contrast pentru butoane */
  }

  label {
    display: block;
    margin-top: 10px;
  }

  html {
    filter: invert(100%) hue-rotate(180deg) !important; /* Ajustare colorblind */
  }

  a, button {
    border: 2px solid #000 !important; /* Elemente interactive clare */
  }

  :focus {
    outline: 3px solid #00f !important; /* Evidențiere la focus */
  }
</style>
`
      ;
      document.head.appendChild(style);
      console.log('Colorblind mode applied');
    } 

  }
  
  // Scroll handler for motor disability
  function scrollHandler(e) {
    if (e.key === 'n') window.scrollBy(0, 100);
  }
  
  // Vision key handler (bonus: press 'r' to read selected text)
  function visionKeyHandler(e) {
    if (e.key === 'r') {
      const selectedText = window.getSelection().toString();
      if (selectedText) {
        const utterance = new SpeechSynthesisUtterance(selectedText);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
        console.log('Reading aloud:', selectedText);
      }
    }
  }
  
  // Handle messages from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateAccessibility') {
      applyAccessibility(message.disability);
    } else if (message.action === 'speakText') {
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      console.log('Speaking:', message.text);
    } else if (message.action === 'toggleContrast') {
      if (document.body.classList.contains('high-contrast')) {
        document.body.classList.remove('high-contrast');
        document.body.classList.add('default-contrast');
        console.log('Switched to default contrast');
      } else {
        document.body.classList.remove('default-contrast');
        document.body.classList.add('high-contrast');
        console.log('Switched to high-contrast yellow');
      }
    } else if (message.action === 'toggleZoom') {
      document.body.style.zoom = document.body.style.zoom === '150%' ? '' : '150%';
      console.log('Zoom set to:', document.body.style.zoom || '100%');
    }
  });
  
  // Apply settings on page load
  window.addEventListener('load', () => {
    chrome.storage.sync.get(['userDisability'], (result) => {
      if (result.userDisability && result.userDisability !== 'none') {
        console.log('Initial load - disability:', result.userDisability);
        applyAccessibility(result.userDisability);
      }
    });
  });