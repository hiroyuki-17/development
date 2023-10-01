document.addEventListener('DOMContentLoaded', function () {
  const generateButton = document.querySelector('#generate-button');
  generateButton.addEventListener('click', generateURLs);

  function generateURLs() {
      const filePathsInput = document.querySelector('#file-paths').value;
      const domain1Name = document.querySelector('#domain1-name').value || 'デモ';
      const domain1URL = formatDomainURL(document.querySelector('#domain1-url').value);
      const domain2Name = document.querySelector('#domain2-name').value || '本番';
      const domain2URL = formatDomainURL(document.querySelector('#domain2-url').value);

      const urlList = document.querySelector('#url-list');
      urlList.innerHTML = ''; // 既存のリストをクリア

      const filePaths = filePathsInput.split('\n').map(line => line.trim());
      const domain1URLs = [];
      const domain2URLs = [];

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

      if (domain1URLs.length > 0) {
          const domain1Header = document.createElement('h3');
          domain1Header.textContent = domain1Name;
          urlList.appendChild(domain1Header);

          for (const url of domain1URLs) {
              const listItem = createLinkListItem(url);
              urlList.appendChild(listItem);
          }
      }

      if (domain2URLs.length > 0) {
          const domain2Header = document.createElement('h3');
          domain2Header.textContent = domain2Name;
          urlList.appendChild(domain2Header);

          for (const url of domain2URLs) {
              const listItem = createLinkListItem(url);
              urlList.appendChild(listItem);
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

  function createLinkListItem(url) {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank'; // 別窓で開く
      link.textContent = url; // URL部分のみを表示
      listItem.appendChild(link);
      return listItem;
  }
});
