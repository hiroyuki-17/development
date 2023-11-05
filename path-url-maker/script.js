document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('generate-button');
    const linkContent = document.getElementById('link-content');
    const filePathsInput = document.getElementById('file-paths');
    const inputDomainDemo = document.getElementById('domain1-url');
    const inputDomainCurrent = document.getElementById('domain2-url');
    const linkOutput1 = document.getElementById('link-output-1');
    const linkOutput2 = document.getElementById('link-output-2');
    const pageOutput = document.getElementById('page-output');
    const copyButton = document.getElementById('copyButton');
    const linkOutputAll = document.getElementById('link-output-all');
    const localStorageDomainDemoLink = localStorage.getItem('savedDomainDemo');
    const localStorageDomainCurrentLink = localStorage.getItem('savedDomainCurrent');
    const ulElement1 = document.createElement('ul');
    const ulElement2 = document.createElement('ul');
    let domain1URLs = [];
    let domain2URLs = [];

    generateButton.addEventListener('click', generateURLs);
    copyButton.addEventListener('click', copyLinkText);

    if (localStorageDomainDemoLink) {
        inputDomainDemo.value = localStorageDomainDemoLink;
    }

    if (localStorageDomainCurrentLink) {
        inputDomainCurrent.value = localStorageDomainCurrentLink;
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
        const domain1Name = document.getElementById('domain1-name').value || 'デモURL';
        const domain2Name = document.getElementById('domain2-name').value || '本番URL';
        const domain1URL = formatDomainURL(inputDomainDemo.value);
        const domain2URL = formatDomainURL(inputDomainCurrent.value);

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
            alert("ドメイン1は無効なドメイン記述です");
            return;
        }

        localStorage.setItem('savedDomainDemo', domain1URL);

        if (domain2URL) {
            if (!isValidDomain(domain2URL)) {
                alert("ドメイン2は無効なドメイン記述です");
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

        if (!pageCount) {
            alert('有効なファイルパスがありません');
            return;
        }

        linkOutput1.innerHTML = '';
        linkOutput2.innerHTML = '';
        ulElement1.innerHTML = '';
        ulElement2.innerHTML = '';

        if (domain1URLs.length > 0) {
            const domain1Header = document.createElement('h3');
            domain1Header.textContent = domain1Name;
            linkOutput1.appendChild(domain1Header);

            for (const url of domain1URLs) {
                const listItem = createLinkListItem(url);
                ulElement1.appendChild(listItem);
            }

            linkOutput1.appendChild(ulElement1);
        }

        if (domain2URLs.length > 0) {
            const domain2Header = document.createElement('h3');
            domain2Header.textContent = domain2Name;
            linkOutput2.appendChild(domain2Header);

            for (const url of domain2URLs) {
                const listItem = createLinkListItem(url);
                ulElement2.appendChild(listItem);
            }

            linkOutput2.appendChild(ulElement2);
        }

        if (pageCount) {
            pageOutput.textContent = 'ページ数: ' + pageCount;
            linkContent.style.display = 'block';
            smoothScroll(linkContent, 300);
        } else {
            linkContent.style.display = 'none';
        }
    }

    function copyLinkText() {
        const textToCopy = linkOutputAll.innerText.trim(); // クリップボードにコピーするテキストを取得

        if (textToCopy) {
            // リンクテキストがある場合のみコピーを試行
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('リンクテキストがコピーされました');
                })
                .catch(err => {
                    console.error('コピーに失敗しました', err);
                    alert('コピーに失敗しました');
                });
        } else {
            alert('コピーするテキストがありません');
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

    function createLinkListItem(url) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.textContent = url;
        listItem.appendChild(link);
        return listItem;
    }
    
    // 重複URLを削除
    // function removeDuplicates(arr) {
    //     return arr.filter((url, index) => arr.indexOf(url) === index);
    // }

    // スムーススクロールの関数
    function smoothScroll(linkContent, duration) {
        const targetElement = linkContent;
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
