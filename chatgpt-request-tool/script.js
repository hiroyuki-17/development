// ボタンクリック時のイベントハンドラ
document.getElementById('generateBtn').addEventListener('click', generateAnswer);

// 回答の生成関数
function generateAnswer() {
  const genre = document.getElementById('genre').value;
  const question = document.getElementById('question').value;
  const background = document.getElementById('background').value;
  const constraints = document.getElementById('constraints').value;

  if (genre === "" || question === "") {
    const errorDiv = document.getElementById('errorDiv');
    errorDiv.textContent = "「ジャンル」と「質問・依頼」は必須項目です。";
    return;
  }

  errorDiv.style.display = 'none';

  let requestText = '';
  requestText += `あなたはプロの${genre}の講師です。\n以下の情報をもとに、考えられうる最高の回答を出力してください。\n`;
  requestText += `依頼したいこと: ${question}\n`;

  if (background) {
    requestText += `背景情報: ${background}\n`;
  }

  if (constraints) {
    requestText += `制約や条件: ${constraints}\n`;
  }

  // テンプレートにその他の要素を追加
  // requestText += '[ここにその他のテンプレートを追加]\n[追加の要望や指示を記述]\n';

  // 生成したテキストを出力エリアに表示
  const outputDiv = document.getElementById('output');
  outputDiv.innerText = requestText;

  // コピーボタンを表示
  const copyBtn = document.getElementById('copyBtn');
  if (requestText.trim() === '') {
    copyBtn.style.display = 'none';
  } else {
    copyBtn.style.display = 'flex';
  }
}

// コピーボタンクリック時のイベントハンドラ
document.getElementById('copyBtn').addEventListener('click', copyText);

// テキストのコピー関数
function copyText() {
  const outputDiv = document.getElementById('output');
  const text = outputDiv.innerText;

  // テキストをクリップボードにコピー
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('テキストがコピーされました');
    })
    .catch((error) => {
      console.error('テキストのコピーに失敗しました:', error);
    });
}