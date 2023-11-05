document.addEventListener('DOMContentLoaded', function () {
    const filePathsInput = document.getElementById('file-paths');
    const generateButton = document.getElementById('generate-button');
    const kenpinContent = document.getElementById('kenpin-content');
    const inputDomainDemo= document.getElementById('domain1-url');
    const inputDomainCurrent= document.getElementById('domain2-url');
    const kenpinOutput2 = document.getElementById('kenpin-output-2');
    const kenpinOutputAll = document.getElementById('kenpin-output-all');
    const OutputDemoUrl = document.getElementById('output-demo-url');
    const copyButton = document.getElementById('copyButton');
    const pageOutput = document.getElementById('page-output');
    const localStorageDomainDemo = localStorage.getItem('savedDomainDemo');
    const localStorageDomainCurrent = localStorage.getItem('savedDomainCurrent');
    let domain1URLs = [];
    let domain2URLs = [];
    let domain3URL;
    let domain4URL;
    generateButton.addEventListener('click', generateKenpinText);
    copyButton.addEventListener('click', copyKenpinText);

      if (localStorageDomainDemo) {
        inputDomainDemo.value =localStorageDomainDemo;
    }

      if (localStorageDomainCurrent) {
        inputDomainCurrent.value =localStorageDomainCurrent;
    }

    function htmlEscape(text) {
        return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

      // 有効ドメインの判定
    function isValidDomain(domain) {
        const domainPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/\S*)?$/;
        return domainPattern.test(domain);
    }

    function removeDuplicates(urls) {
        return [...new Set(urls)];
    }

    function generateURLs() {
        domain1URLs = [];
        domain2URLs = [];
        const filePathsInputValue = filePathsInput.value;
        const domain1URL = formatDomainURL(inputDomainDemo.value);
        const domain2URL = formatDomainURL(document.querySelector('#domain2-url').value);
        domain3URL = document.querySelector('#domain3-url').value;
        domain4URL = document.querySelector('#domain4-url').value;

        const filePaths = filePathsInputValue.split('\n').map(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('http://') || trimmedLine.startsWith('https://')) {
                const url = new URL(trimmedLine);
                const domain = url.origin;
                const path = url.pathname;
                return { domain, path };
            } else {
                const match = trimmedLine.match(/(\/docs\/|\/public\/|\\docs\\|\\public\\)(.*)/);
                if (match) {
                    return { domain: '', path: match[2] };
                } else {
                    return { domain: '', path: trimmedLine };
                }
            }
        });

        if (!filePathsInputValue || !domain1URL) {
            alert('必要なテキストが不足しています');
            return;
        }

        if (!isValidDomain(domain1URL)) {
            alert("デモドメインは無効なドメイン記述です");
            return;
        }

        localStorage.setItem('savedDomainDemo', domain1URL);

        if (domain2URL) {
            if (!isValidDomain(domain2URL)) {
                alert("本番ドメインは無効なドメイン記述です");
                return;
            }
        }

        localStorage.setItem('savedDomainCurrent', domain2URL);

        for (const file of filePaths) {
            const { domain, path } = file;
            if (path.endsWith('.html') || path.endsWith('.ejs') || /(\/|\\)$/.test(path)) {
                if (domain1URL) {
                    const url1 = `${domain1URL}${path.replace(/\\/g, '/').replace(/^\//, '').replace('.ejs', '.html')}`;
                    domain1URLs.push(url1);
                }
                if (domain2URL) {
                    const url2 = `${domain2URL}${path.replace(/\\/g, '/').replace(/^\//, '').replace('.ejs', '.html')}`;
                    domain2URLs.push(url2);
                }
            }
        }
        // 重複を削除
        domain1URLs = removeDuplicates(domain1URLs);
        domain2URLs = removeDuplicates(domain2URLs);

        const pageCount = domain1URLs.length;

        if(!pageCount) {
            alert('有効なパスがありません');
            return;
        }

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
        OutputDemoUrl.innerHTML = ''; // 既存のテキストをクリア
        kenpinOutput2.innerHTML = '';

        for (let i = 0; i < domain1URLs.length || i < domain2URLs.length; i++) {
            const templateCopy = template.content.cloneNode(true);
            // URL1に生成されたURLを埋め込む
            const url1Output = templateCopy.querySelector('#url1-output');

            if (i < domain1URLs.length) {
                url1Output.textContent = domain1URLs[i];
                OutputDemoUrl.innerHTML += domain1URLs[i] + '<br>';
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
                url4Output.innerHTML = 'デザイン：<br>' + htmlEscape(domain4URL) + '<br><br>'
            } else {
                url4Output.style.display = 'none';
            }

            kenpinOutput2.appendChild(templateCopy);
            kenpinOutputAll.value = templateCopy;
        }

        if (domain1URLs.length) {
            kenpinContent.style.display = 'block';
            smoothScroll(kenpinContent, 300);
        } else {
            kenpinContent.style.display = 'none';
        }
    }

    function copyKenpinText() {
        const textToCopy = kenpinOutputAll.innerText.trim(); // クリップボードにコピーするテキストを取得

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

    // スムーススクロールの関数
    function smoothScroll(kenpinContent, duration) {
        const targetElement = kenpinContent;

        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = performance.now();

        function animate(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            window.scrollTo(0, startPosition + distance * progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }
  });