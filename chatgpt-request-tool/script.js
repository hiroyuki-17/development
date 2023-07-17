const genre = document.getElementById('genre');
const generateBtn = document.getElementById('generateBtn');
const programmingFields = document.getElementById('input-programming');
const outputDiv = document.getElementById('output');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copyBtn');
let requestText = '';
let genreValue = document.getElementById('genre').value;
let question = document.getElementById('question').value;
// let programmingLanguage = document.getElementById('programmingLanguage').value;
let codeSnippet = document.getElementById('codeSnippet').value;
let errorMessage = document.getElementById('errorMessage').value;
let triedSolution = document.getElementById('triedSolution').value;
let expectedResult = document.getElementById('expectedResult').value;
let background = document.getElementById('background').value;
let constraints = document.getElementById('constraints').value;

// 生成ボタンクリック時のイベントハンドラ
generateBtn.addEventListener('click', generateAnswer);

// ジャンルの選択時のイベントハンドラ
genre.addEventListener('change', toggleAdditionalFields);

// 回答の生成関数
function generateAnswer() {
  genreValue = document.getElementById('genre').value;
  question = document.getElementById('question').value;
  
  if (genreValue === "" || question === "") {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.style.display = 'block';
    return;
  }

  errorDiv.style.display = 'none';
  resetAnswer();

  // programmingLanguage = document.getElementById('programmingLanguage').value;
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
  background = document.getElementById('background').value;
  constraints = document.getElementById('constraints').value;

  requestText += `あなたは${genreValue}の専門家です。\n以下の情報をもとに、最高の回答をお願いします。\n`;
  requestText += `依頼したい内容: ${question}`;

  if (genreValue === "プログラミング") {
    if (codeSnippet || errorMessage || triedSolution || expectedResult || background || constraints) {
      requestText += `\n詳細情報：`;
    }

    // チェックがあった場合のみ出力
    if (selectedLanguages.length > 0) {
      requestText += `\n・プログラミング言語： ${selectedLanguages}`;
    }
  
    if (codeSnippet) {
      requestText += `\n・コードサンプル：${codeSnippet}`;
    }
  
    if (errorMessage) {
      requestText += `\n・エラーメッセージ： ${errorMessage}`;
    }
  
    if (triedSolution) {
      requestText += `\n・試したこと： ${triedSolution}`;
    }
  
    if (expectedResult) {
      requestText += `\n・期待する結果： ${expectedResult}`;
    }
  }

  if (background) {
    requestText += `\n背景情報: ${background}`;
  }

  if (constraints) {
    requestText += `\n制約や条件: ${constraints}`;
  }

  if (genreValue === "プログラミング") {
    requestText += '\n以上。上記について、英語圏の情報で検討したあとに日本語で回答をお願いします。';
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
  background = '';
  constraints = '';
  requestText = '';
  outputText.innerText = '';
}

// ジャンル選択時に追加の入力欄を表示/非表示する
function toggleAdditionalFields() {
  const genreValue = document.getElementById('genre').value;
  outputText.innerText = '';
  copyBtn.style.display = 'none';
  outputDiv.style.display = 'none';

  // プログラミングが選択された場合のみ追加の入力欄を表示
  if (genreValue === "プログラミング") {
    programmingFields.style.display = 'block';
  } else {
    programmingFields.style.display = 'none'; // 追加の入力欄を非表示
  }
}