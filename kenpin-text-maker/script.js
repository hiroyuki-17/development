document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate-button');
    const kenpinOutput = document.getElementById('kenpin-output');
    const copyButton = document.getElementById('copyButton');
    const pageOutput = document.getElementById('page-output');
    let domain1URLs = [];
    let domain2URLs = [];
    let domain3URL;
    let domain4URL;
    generateButton.addEventListener('click', generateKenpinText);
    copyButton.addEventListener('click', copyKenpinText);
  
    function htmlEscape(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function generateURLs() {
        domain1URLs = [];
        domain2URLs = [];
        const filePathsInput = document.querySelector('#file-paths').value;
        const domain1URL = formatDomainURL(document.querySelector('#domain1-url').value);
        const domain2URL = formatDomainURL(document.querySelector('#domain2-url').value);
        domain3URL = document.querySelector('#domain3-url').value;
        domain4URL = document.querySelector('#domain4-url').value;
  
        // const filePaths = filePathsInput.split('\n').map(line => line.trim());
        const filePaths = filePathsInput.split('\n').map(line => {
            const trimmedLine = line.trim();
            // /docs/ または /public/ の直後の部分以降のパスを抽出
            const match = trimmedLine.match(/(\/docs\/|\/public\/)(.*)/);
            if (match) {
                return match[2]; // サブディレクトリ以降のパスを取得
            } else {
                return trimmedLine; // /docs/ または /public/ が見つからない場合は元のパスをそのまま使用
            }
        });

        if (!filePathsInput || !domain1URL) {
            alert('必要なテキストがありません');
            return;
        }    

        for (const filePath of filePaths) {
            console.log(filePath);
            if (filePath.endsWith('.html')) {
                if (domain1URL) {
                    const url1 = `${domain1URL}${filePath.replace(/\\/g, '/').replace(/^\//, '')}`;
                    domain1URLs.push(url1);
                }
  
                if (domain2URL) {
                    const url2 = `${domain2URL}${filePath.replace(/\\/g, '/').replace(/^\//, '')}`;
                    domain2URLs.push(url2);
                }
            }
        }

        const pageCount = domain1URLs.length;
        pageOutput.textContent = 'ページ数: ' + pageCount;
    }
  
    function formatDomainURL(url) {
        // URLの最後がスラッシュで終わっている場合、スラッシュを削除
        if (url.endsWith('/')) {
            url = url.slice(0, -1);
        }
        // URLの最後にスラッシュを追加
        if (url) {
            url += '/';
        }
        return url;
    }

    function generateKenpinText() {
        generateURLs();
        const template = document.getElementById('template');
        
        kenpinOutput.innerHTML = ''; // 既存のテキストをクリア

        for (let i = 0; i < domain1URLs.length || i < domain2URLs.length; i++) {
            const templateCopy = template.content.cloneNode(true);
    
            // URL1に生成されたURLを埋め込む
            const url1Output = templateCopy.querySelector('#url1-output');

            if (i < domain1URLs.length) {
                url1Output.textContent = domain1URLs[i];
            } else {
                url1Output.textContent = 'なし';
            }
    
            // URL2に生成されたURLを埋め込む
            const url2Output = templateCopy.querySelector('#url2-output');

            if (i < domain2URLs.length) {
                url2Output.textContent = domain2URLs[i];
            } else {
                url2Output.textContent = 'なし';
            }
            
            const url3Output = templateCopy.querySelector('#url3-output');
            
            if (domain3URL) {
                url3Output.innerHTML = 'デザイン：<br>' + htmlEscape(domain3URL) + '<br><br>'
            } else {
                url3Output.style.display = 'none';
            }
            
            const url4Output = templateCopy.querySelector('#url4-output');
            
            if (domain4URL) {
                url4Output.textContent = domain4URL;
            }

            kenpinOutput.appendChild(templateCopy);
            kenpinOutput.value = templateCopy;
        }
    }

    function copyKenpinText() {
        const kenpinOutput = document.querySelector('#kenpin-output');
        const textToCopy = kenpinOutput.innerText.trim(); // クリップボードにコピーするテキストを取得

        if (textToCopy) {
            // テキストがある場合のみコピーを試行
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('依頼内容のテキストがコピーされました');
                })
                .catch(err => {
                    console.error('コピーに失敗しました', err);
                    alert('コピーに失敗しました');
                });
        } else {
            alert('コピーするテキストがありません');
        }
    }
  });