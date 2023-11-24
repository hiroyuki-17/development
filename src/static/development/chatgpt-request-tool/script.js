const genre = document.getElementById('genre');
const generateBtn = document.getElementById('generateBtn');
const programmingFields = document.getElementById('input-programming');
const materialFields = document.getElementById('input-material');
const digestFields = document.getElementById('input-digest');
const outputDiv = document.getElementById('outputDiv');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copyBtn');
const errorDiv = document.getElementById('errorDiv');
const requestContentLabel = document.getElementById('requestContentLabel');
const requestContent = document.getElementById('requestContent');
let requestText = '';

let genreValue, requestValue, codeSnippetValue, errorMessageValue, triedSolutionValue, expectedResultValue, constraintsValue, materialTargetValue, materialRequiredValue, materialFormatValue, materialReferenceValue, digestPurposeValue, digestLengthValue, digestPointValue;

// 生成ボタンクリック時のイベントハンドラ
generateBtn.addEventListener('click', generateAnswer);

// ジャンルの選択時のイベントハンドラ
genre.addEventListener('change', toggleAdditionalFields);

// 回答の生成関数
function generateAnswer() {
  // const requiredInputs = document.querySelectorAll('[required]');
  genreValue = genre.value;
  requestValue = requestContent.value;

  if (genreValue === ""|| requestValue === "") {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'block';
    outputText.innerText = '';
    outputDiv.style.display = 'none';
    errorDiv.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  errorDiv.style.display = 'none';
  resetAnswer();

  const checkboxes = document.getElementsByName("programmingLanguage");
  // const selectedLanguages = [];

  const selectedLanguages = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

  // checkboxes.forEach((checkbox) => {
  //   if (checkbox.checked) {
  //     selectedLanguages.push(checkbox.value);
  //   }
  // });

  codeSnippetValue = document.getElementById('codeSnippet').value;
  errorMessageValue = document.getElementById('errorMessage').value;
  triedSolutionValue = document.getElementById('triedSolution').value;
  expectedResultValue = document.getElementById('expectedResult').value;
  // background = document.getElementById('background').value;
  constraintsValue = document.getElementById('constraints').value;
  // 資料作成の回答結果
  materialTargetValue = document.getElementById('materialTarget').value;
  materialRequiredValue = document.getElementById('materialRequired').value;
  materialFormatValue = document.getElementById('materialFormat').value;
  materialReferenceValue = document.getElementById('materialReference').value;
  // 文章の要約の回答結果
  digestPurposeValue = document.getElementById('digestPurpose').value;
  digestLengthValue = document.getElementById('digestLength').value;
  digestPointValue = document.getElementById('digestPoint').value;

  requestText += `あなたは${genreValue}の専門家です。\n以下の依頼内容・詳細情報をもとに、最善の回答をお願いします。\n`;
  
  if (!(genreValue === "文章の要約")) {
    requestText += `#依頼内容:\n${requestValue}\n`;
  }

  if (genreValue === "プログラミング") {
    if (selectedLanguages.length > 0 || codeSnippetValue || errorMessageValue || triedSolutionValue || expectedResultValue || constraintsValue) {
      requestText += `\n#詳細情報：`;
    }

    // チェックがあった場合のみ出力
    if (selectedLanguages.length > 0) {
      requestText += `\n・プログラミング言語： ${selectedLanguages}`;
    }
  
    if (codeSnippetValue) {
      requestText += `\n・コードサンプル：\n\`\`\`\n${codeSnippetValue}\n\`\`\``;
    }
  
    if (errorMessageValue) {
      requestText += `\n・エラーメッセージ：\n${errorMessageValue}`;
    }
  
    if (triedSolutionValue) {
      requestText += `\n・試したこと：\n${triedSolutionValue}`;
    }
  
    if (expectedResultValue) {
      requestText += `\n・期待する結果：\n${expectedResultValue}`;
    }
  }

  if (genreValue === "資料作成") {
    if (materialTargetValue || materialRequiredValue || materialFormatValue || materialReferenceValue) {
      requestText += `\n#詳細情報：`;
    }

    if (materialTargetValue) {
      requestText += `\n・ターゲット読者： ${materialTargetValue}`;
    }

    if (materialFormatValue) {
      requestText += `\n・資料の形式： ${materialFormatValue}`;
    }

    if (materialRequiredValue) {
      requestText += `\n・必要な情報：\n${materialRequiredValue}`;
    }

    if (materialReferenceValue) {
      requestText += `\n・参考資料：\n${materialReferenceValue}`;
    }
  }

  if (genreValue === "文章の要約") {
    if (requestValue) {
      requestText += `\n#要約対象の文章：\n${requestValue}`;
    }

    if (digestPurposeValue || digestLengthValue || digestPointValue) {
      requestText += `\n#詳細情報：`;
    }

    if (digestPurposeValue) {
      requestText += `\n・要約の目的：\n${digestPurposeValue}`;
    }

    if (digestLengthValue) {
      requestText += `\n・要約の長さ：\n${digestLengthValue}`;
    }

    if (digestPointValue) {
      requestText += `\n・要約の重要ポイント：\n${digestPointValue}`;
    }
  }

  // if (background) {
  //   requestText += `\n背景情報: ${background}`;
  // }

  if (constraintsValue) {
    requestText += `\n・制約や条件:\n${constraintsValue}`;
  }

  if (genreValue === "プログラミング") {
    requestText += '\n以上です。上記について、英語圏の情報で検討したあとに全文日本語で回答をお願いします。';
  }

  // テンプレートにその他の要素を追加
  // requestText += '[ここにその他のテンプレートを追加]\n[追加の要望や指示を記述]\n';

  // 生成したテキストを出力エリアに表示
  outputText.style.display = 'block';
  outputText.innerText = requestText;

  // コピーボタンを表示
  if (requestText.trim() === '') {
    copyBtn.style.display = 'none';
    return;
  }

  outputDiv.style.display = 'block';
  copyBtn.style.display = 'flex';
  outputDiv.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('copyBtn').addEventListener('mousedown', highlight);

// コピーボタンクリック時のイベントハンドラ
document.getElementById('copyBtn').addEventListener('click', copyText);

// テキストのコピー関数
function copyText() {
  const outputText = document.getElementById('output-text');
  const text = outputText.innerText;

  // テキストをクリップボードにコピー
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('テキストがコピーされました');
    })
    .catch((error) => {
      console.error('テキストのコピーに失敗しました:', error);
    });
}

// 回答内容のリセット
function resetAnswer() {
  programmingLanguage = '';
  codeSnippetValue = '';
  errorMessageValue = '';
  triedSolutionValue = '';
  expectedResultValue = '';
  // background = '';
  constraintsValue = '';
  requestText = '';
  materialTargetValue = '';
  materialRequiredValue = '';
  materialFormatValue = '';
  materialReferenceValue = '';
  outputText.innerText = '';
}

// ジャンル選択時に追加の入力欄を表示/非表示する
function toggleAdditionalFields() {
  const genreValue = document.getElementById('genre').value;
  outputText.innerText = '';
  copyBtn.style.display = 'none';
  outputDiv.style.display = 'none';
  errorDiv.style.display = 'none';

  // 「プログラミング」が選択された場合のみ追加の入力欄を表示
  if (genreValue === "プログラミング") {
    programmingFields.style.display = 'block';
  } else {
    programmingFields.style.display = 'none'; // 追加の入力欄を非表示
  }

  // 「資料作成」が選択された場合のみ追加の入力欄を表示
  if (genreValue === "資料作成") {
    materialFields.style.display = 'block';
  } else {
    materialFields.style.display = 'none';
  }

  // 「文章の要約」が選択された場合のみ追加の入力欄を表示
  if (genreValue === "文章の要約") {
    digestFields.style.display = 'block';
    requestContentLabel.innerText = '要約対象の文章'
    requestContent.placeholder = 'ここに要約対象の文章を記述';
  } else {
    digestFields.style.display = 'none';
    requestContentLabel.innerText = '依頼内容'
    requestContent.placeholder = 'ChatGPTに依頼したい具体的な内容を入力してください';
  }
}

// 文字をハイライト
function highlight() {
  const text = outputText.innerHTML;
  const markedText = '<mark>' + text + '</mark>';
  outputText.innerHTML = markedText;
}