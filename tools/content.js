let brightnessFilter = 100;
let zoomLevel = 1;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "increaseBrightness") {
    brightnessFilter = Math.min(150, brightnessFilter + 10);
    document.body.style.filter = `brightness(${brightnessFilter}%)`;
  } else if (message.action === "decreaseBrightness") {
    brightnessFilter = Math.max(50, brightnessFilter - 10);
    document.body.style.filter = `brightness(${brightnessFilter}%)`;
  } else if (message.action === "muteAudio") {
    document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = true;
    });
  } else if (message.action === "unmuteAudio") {
    document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = false;
    });
  } else if (message.action === "zoomIn") {
    zoomLevel = Math.min(2, zoomLevel + 0.1);
    document.body.style.zoom = zoomLevel;
  } else if (message.action === "zoomOut") {
    zoomLevel = Math.max(0.5, zoomLevel - 0.1);
    document.body.style.zoom = zoomLevel;
  }
});
