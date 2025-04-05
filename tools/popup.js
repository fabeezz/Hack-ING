document.getElementById("settingsMenu").addEventListener("change", (event) => {
  const selectedPage = event.target.value;
  if (selectedPage) {
    chrome.tabs.create({ url: chrome.runtime.getURL(selectedPage) });
    event.target.value = ""; // Resetează dropdown-ul
  }
});
