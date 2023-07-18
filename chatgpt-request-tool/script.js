const genre = document.getElementById('genre');
const generateBtn = document.getElementById('generateBtn');
const programmingFields = document.getElementById('input-programming');
const materialFields = document.getElementById('input-material');
const digestFields = document.getElementById('input-digest');
const outputDiv = document.getElementById('output');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copyBtn');
const errorDiv = document.getElementById('errorDiv');
const requestContentLabel = document.getElementById('requestContentLabel');
const requestContent = document.getElementById('requestContent');
let requestText = '';
let genreValue = document.getElementById('genre').value;
let requestValue = document.getElementById('requestContent').value;
let codeSnippet = document.getElementById('codeSnippet').value;
let errorMessage = document.getElementById('errorMessage').value;
let triedSolution = document.getElementById('triedSolution').value;
let expectedResult = document.getElementById('expectedResult').value;
// let background = document.getElementById('background').value;
let constraints = document.getElementById('constraints').value;

// 生成ボタンクリック時のイベントハンドラ
generateBtn.addEventListener('click', generateAnswer);

// ジャンルの選択時のイベントハンドラ
genre.addEventListener('change', toggleAdditionalFields);

// 回答の生成関数
function generateAnswer() {
  // const requiredInputs = document.querySelectorAll('[required]');
  genreValue = document.getElementById('genre').value;
  requestValue = document.getElementById('requestContent').value;

  if (genreValue === ""|| requestValue === "") {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'block';
    outputText.innerText = '';
    return;
  }

  errorDiv.style.display = 'none';
  resetAnswer();

  const checkboxes = document.getElementsByName("programmingLanguage");
  const selectedLanguages = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedLanguages.push(checkbox.value);
    }
  });

  console.log(selectedLanguages);
  codeSnippet = document.getElementById('codeSnippet').value;
  errorMessage = document.getElementById('errorMessage').value;
  triedSolution = document.getElementById('triedSolution').value;
  expectedResult = document.getElementById('expectedResult').value;
  // background = document.getElementById('background').value;
  constraints = document.getElementById('constraints').value;
  // 資料作成の回答結果
  materialTarget = document.getElementById('materialTarget').value;
  materialRequired = document.getElementById('materialRequired').value;
  materialFormat = document.getElementById('materialFormat').value;
  materialReference = document.getElementById('materialReference').value;
  // 文章の要約の回答結果
  digestPurpose = document.getElementById('digestPurpose').value;
  digestLength = document.getElementById('digestLength').value;
  digestPoint = document.getElementById('digestPoint').value;

  requestText += `あなたは${genreValue}の専門家です。\n以下の依頼内容・詳細情報をもとに、最善の回答をお願いします。\n`;
  
  if (!(genreValue === "文章の要約")) {
    requestText += `#依頼内容:\n${requestValue}\n`;
  }

  if (genreValue === "プログラミング") {
    if (selectedLanguages.length > 0 || codeSnippet || errorMessage || triedSolution || expectedResult || constraints) {
      requestText += `\n#詳細情報：`;
    }

    // チェックがあった場合のみ出力
    if (selectedLanguages.length > 0) {
      requestText += `\n・プログラミング言語： ${selectedLanguages}`;
    }
  
    if (codeSnippet) {
      requestText += `\n・コードサンプル：\n\`\`\`\n${codeSnippet}\n\`\`\``;
    }
  
    if (errorMessage) {
      requestText += `\n・エラーメッセージ：\n${errorMessage}`;
    }
  
    if (triedSolution) {
      requestText += `\n・試したこと：\n${triedSolution}`;
    }
  
    if (expectedResult) {
      requestText += `\n・期待する結果：\n${expectedResult}`;
    }
  }

  if (genreValue === "資料作成") {
    if (materialTarget || materialRequired || materialFormat || materialReference) {
      requestText += `\n#詳細情報：`;
    }

    if (materialTarget) {
      requestText += `\n・ターゲット読者： ${materialTarget}`;
    }

    if (materialFormat) {
      requestText += `\n・資料の形式： ${materialFormat}`;
    }

    if (materialRequired) {
      requestText += `\n・必要な情報：\n${materialRequired}`;
    }

    if (materialReference) {
      requestText += `\n・参考資料：\n${materialReference}`;
    }
  }

  if (genreValue === "文章の要約") {
    if (requestValue) {
      requestText += `\n#要約対象の文章：\n${requestValue}`;
    }

    if (digestPurpose || digestLength || digestPoint) {
      requestText += `\n#詳細情報：`;
    }

    if (digestPurpose) {
      requestText += `\n・要約の目的：\n${digestPurpose}`;
    }

    if (digestLength) {
      requestText += `\n・要約の長さ：\n${digestLength}`;
    }

    if (digestPoint) {
      requestText += `\n・要約の重要ポイント：\n${digestPoint}`;
    }
  }

  // if (background) {
  //   requestText += `\n背景情報: ${background}`;
  // }

  if (constraints) {
    requestText += `\n・制約や条件:\n${constraints}`;
  }

  if (genreValue === "プログラミング") {
    requestText += '\n以上です。上記について、英語圏の情報で検討したあとに日本語で回答をお願いします。';
  }

  // テンプレートにその他の要素を追加
  // requestText += '[ここにその他のテンプレートを追加]\n[追加の要望や指示を記述]\n';

  // 生成したテキストを出力エリアに表示
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
  codeSnippet = '';
  errorMessage = '';
  triedSolution = '';
  expectedResult = '';
  // background = '';
  constraints = '';
  requestText = '';
  materialTarget = '';
  materialRequired = '';
  materialFormat = '';
  materialReference = '';
  outputText.innerText = '';
}

// ジャンル選択時に追加の入力欄を表示/非表示する
function toggleAdditionalFields() {
  const genreValue = document.getElementById('genre').value;
  outputText.innerText = '';
  copyBtn.style.display = 'none';
  outputDiv.style.display = 'none';

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