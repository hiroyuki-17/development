const inputArea = document.getElementById('inputArea');
const outputArea = document.getElementById('outputArea');
const copyButton = document.getElementById('copyButton');
const clipboardText = "clipboard";

inputArea.addEventListener('input', () => {
  const text = inputArea.value;
  const replacedText = text.replace(/(\r\n|\r|\n){2}/g, '\n');

  outputArea.value = replacedText;
});

copyButton.addEventListener('click', () => {
  outputArea.select();
  navigator.clipboard.writeText(clipboardText);
});