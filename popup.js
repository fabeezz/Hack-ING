document.getElementById('sendMessageBtn').addEventListener('click', function () {
    console.log("Sending message to Python...");
  
    const port = chrome.runtime.connectNative("com.example.nativehost");
  
    port.onMessage.addListener((msg) => {
      console.log("Received from Python:", msg);
      // Update status text with response from Python
      document.getElementById('status').textContent = "Received from Python: " + msg.response;
    });
  
    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        console.error("Disconnected:", chrome.runtime.lastError.message);
        document.getElementById('status').textContent = "Error communicating with Python.";
      }
    });
  
    // Send message to Python script
    port.postMessage({ text: "Hello from Extension!" });
  });
  