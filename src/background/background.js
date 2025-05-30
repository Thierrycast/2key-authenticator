chrome.action.onClicked.addListener(() => {
  const width = 360;
  const height = 500;

  chrome.windows.getCurrent((currentWindow) => {
    chrome.windows.create({
      url: "src/popup/index.html",
      type: "popup",
      width: width,
      height: height,
      top: currentWindow.top + 90,
      left: (currentWindow.left ?? 0) + (currentWindow.width ?? 1280) - width - 20,
      focused: true
    });
  });
});
