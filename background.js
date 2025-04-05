chrome.action.onClicked.addListener(() => {
    console.log("Extension icon clicked.");
    
    const port = chrome.runtime.connectNative("com.example.nativehost");
  
    // Create a message to send
    const message = {
      text: "Hello from Extension and Cosmin!"
    };
  
    // Log the message before sending
    console.log("Sending message to Python:", message);
  
    port.postMessage(message);
  
    port.onMessage.addListener((msg) => {
      console.log("Received from Python:", msg);
    });
  
    port.onDisconnect.addListener(() => {
      if (chrome.runtime.lastError) {
        console.error("Disconnected:", chrome.runtime.lastError.message);
      }
    });
  });
  