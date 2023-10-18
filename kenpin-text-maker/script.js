document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate-button');
    const kenpinOutput = document.getElementById('kenpin-output');
    const copyButton = document.getElementById('copyButton');
    let domain1URLs = [];
    let domain2URLs = [];
    let domain3URL = document.querySelector('#domain3-url').value;
    let domain4URL = document.querySelector('#domain4-url').value;
    generateButton.addEventListener('click', generateKenpinText);
    copyButton.addEventListener('click', copyKenpinText);
  
    function generateURLs() {
        domain1URLs = [];
        domain2URLs = [];
        const filePathsInput = document.querySelector('#file-paths').value;
        const domain1URL = formatDomainURL(document.querySelector('#domain1-url').value);
        const domain2URL = formatDomainURL(document.querySelector('#domain2-url').value);
        domain3URL = document.querySelector('#domain3-url').value;
        domain4URL = document.querySelector('#domain4-url').value;
  
        const filePaths = filePathsInput.split('\n').map(line => line.trim());

        for (const filePath of filePaths) {
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
                url3Output.textContent = domain3URL;
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
                    alert('テキストがコピーされました');
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