document.addEventListener("DOMContentLoaded", function() {
    const copyButtons = document.querySelectorAll(".m-btn-copy");

    copyButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            const codeContainer = button.previousElementSibling;
            
            if (codeContainer) {
                const textToCopy = codeContainer.textContent;

                if (navigator.clipboard) {
                    // Clipboard API をサポートしている場合
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            button.textContent = "コードをCopyしました！";
                            setTimeout(function() {
                                button.textContent = "Copy";
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                } else {
                    // Clipboard API がサポートされていない場合のバックアップ
                    const textarea = document.createElement("textarea");
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.body.removeChild(textarea);

                    button.textContent = "Copied!";
                    setTimeout(function() {
                        button.textContent = "Copy";
                    }, 2000);
                }
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // .m-hdg-lv2要素を取得
    const headings = document.querySelectorAll(".m-hdg-lv2");

    // .js-link-list要素を取得
    const linkList = document.querySelector(".js-link-list");
    
    const listItems = document.createElement("ol");
    linkList.appendChild(listItems);
    listItems.classList.add("m-link-list");

    // リンクリストを生成して出力
    headings.forEach(function(heading) {
        // ヘッダのテキストとid属性を取得
        const headingText = heading.textContent;
        const headingId = heading.getAttribute("id");

        // アンカーリンクを作成
        const anchorLink = document.createElement("a");
        anchorLink.setAttribute("href", `#${headingId}`);
        anchorLink.textContent = headingText;

        // リンクリストにアイテムを追加
        const listItem = document.createElement("li");
        listItem.appendChild(anchorLink);
        listItems.appendChild(listItem);
    });
});