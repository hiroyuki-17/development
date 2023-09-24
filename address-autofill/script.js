document.addEventListener('DOMContentLoaded', function () {
  const zipcodeInput = document.getElementById('zipcode');
  const searchButton = document.getElementById('searchButton');
  const prefectureInput = document.getElementById('prefecture');
  const addressInput = document.getElementById('address');
  // const addressInput = document.getElementById('address');

  searchButton.addEventListener('click', function () {
    const zipcode = zipcodeInput.value.replace(/-/g, ''); // ハイフンを削除

    // 郵便番号検索APIのURL
    const apiUrl = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.status === 200 && data.results.length > 0) {
          const result = data.results[0];
          prefectureInput.value = result.address1;
          addressInput.value = result.address2 + result.address3;
          // addressInput.value = result.address3;
        } else {
          alert('該当する郵便番号が見つかりませんでした。');
        }
      })
      .catch(error => {
        console.error('エラーが発生しました:', error);
      });
  });
});

// window.addEventListener("beforeunload", function(e) {
//   var confirmationMessage = "入力内容を破棄します。";
//   e.returnValue = confirmationMessage;
//   return confirmationMessage;
// });