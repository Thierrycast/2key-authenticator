chrome.action.onClicked.addListener(() => {
  const width = 410;
  const height = 500;

  // Obtem a largura da tela principal do navegador
  chrome.windows.getCurrent((currentWindow) => {
    chrome.windows.create({
      url: "popup.html",
      type: "popup",
      width: width,
      height: height,
      top: currentWindow.top + 90,
      left: (currentWindow.left ?? 0) + (currentWindow.width ?? 1280) - width - 20,
      focused: true
    });
  });
});
