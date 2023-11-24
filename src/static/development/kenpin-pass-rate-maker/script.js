let averagePassingRate;
let averageDefectRate;
let tableRows = [];
let tableRows2 = [];
let passResult = '';
let failResult = '';
let lhr = 0;
let excluded = 0;
const output = document.getElementById("output");
const content = document.getElementById('content');
const nextWednesdayDate = getNextWednesdayDate();

function generateMarkdown() {
    const passRateAndTable = document.getElementById("passRate").value;
    const failRateAndTable = document.getElementById("failRate").value;
    let commentValue = document.getElementById("comment").value;
    const replacedComment = commentValue.replace(/(\r\n|\r|\n){2}/g, '\n');

    // 検品合格率の処理
    const passRateLines = passRateAndTable.split('\n');
    const passRateTableRows = generateTable(passRateLines, true);

    // 依頼不備率の処理
    const failRateLines = failRateAndTable.split('\n');
    const failRateTableRows = generateTable(failRateLines, false);

    // 合格率と不備率のテーブルを生成
    const passRateTable = generatePassRateTable("合格率", passRateTableRows);
    const failRateTable = generateFailRateTable("不備率", failRateTableRows);

    // マークダウンテンプレート生成
    const markdownTemplate = `先週までの合格率・不備率の共有です.<br><br>

※ 親課題（23年度）：MLC_MOS-1547<br><br>

${passRateTable}<br>${passResult}<br><br>
${failRateTable}<br>${failResult}<br><br>

## コメント<br>
${replacedComment.replace(/\n/g, '<br>\n')}<br><br>

## 改善アクション<br>
上記コメントの該当案件で修正有の方（添付エクセル参照）はお手数ですが、${nextWednesdayDate}（水）までに原因と改善できそうなアクションのコメントをお願い致します.<br><br>

※案件由来なのか個人に起因するのかを確認したいため自身の合格率に限らず **1つでも戻しがあれば** 報告をお願いします.（該当案件限定）<br><br>

※原因は **何が引っかかったかではなく、「何故」ひっかかったのか.** 原稿精度？検品意識？検品方法?<br>
アクションは、コンパクトな内容でひとつ.<br>
1～2週間で実施可能かつ合格率（＝案件ごとの合格件数）への反映が見込めることを目安に策定ください.<br><br>

※ 特に品管から指摘がなくとも、**パフォーマンス未達による「修正あり」の場合もある** ので、原因分析の際に記載お願いします.<br><br>

※ **検品合格率と依頼不備率は別の問題です.検品不合格の原因分析に依頼不備を混同させないてください.**<br><br>

### 改善コメントテンプレート<br><br>

\`\`\`<br>
* 案件名<br>
* 原因：原因を記載。<br>
* 改善アクション：原因を解消するための改善策を記載。努力目標とならないよう。<br>
\`\`\`<br><br>


## 合格率格納場所<br><br>

\`\`\`<br>
\\\\mikan\section\\33_MOS\制作\\DC1\検品関連<br>
\`\`\`<br><br>

### 23年度の週次データ<br><br>

\`\`\`<br>
\\\\mikan\section\\33_MOS\制作\\DC1\検品関連\週次データ置き場\\2023年度<br>
\`\`\`<br><br>

[23年度の累計月次データ](https://mitsuelinks.sharepoint.com/:x:/r/sites/MOS/Shared%20Documents/General/%E3%80%90%E6%A4%9C%E5%93%81%E5%90%88%E6%A0%BC%E7%8E%87%E3%80%912023%E5%B9%B4%E5%BA%A6%E3%83%87%E3%83%BC%E3%82%BF.xlsx?d=we1d5ac2ff8fd4bce9835f31aaebdb2a0&csf=1&web=1&e=29D6LK&nav=MTVfezA0MTY1QjMxLTNCN0QtNDkyNy04NERCLTcxNEQ2QzZGNDlGMX0)
`;

    // 必要な項目が入力されているかチェック
    if (!passRateAndTable || !failRateAndTable || !commentValue) {
        alert("必要な項目が入力されていません。");
        return;
    }

    if (!tableRows.length || !tableRows2.length) {
        return;
    }

    content.style.display = 'block';
    output.innerHTML = markdownTemplate;
    smoothScroll(content, 300);
}

function copyToClipboard() {
    const textToCopy = output.innerText;

    if (textToCopy) {
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

function generateTable(lines, isPassRate) {
    let totalRequest = 0;
    let totalFail = 0;
    let totalRequest2 = 0;
    let totalFail2 = 0;
    let totalLhr = 0;
    let totalExcluded = 0;
    
    if (isPassRate) {
        tableRows = [];
    } else {
        tableRows2 = [];
    }

    lines.forEach(line => {
        if (line.startsWith('MLC')) {
            const fields = line.split('\t');
            const name = fields[0];
            const request = parseInt(fields[1]) || 0;
            const fail = parseInt(fields[2]) || 0;
            lhr = 0;

            if (isPassRate) {
                if (fields[3].length) {
                    lhr = parseInt(fields[3]);
                }
                
                const total = request + fail + lhr;
                const rate = ((fail / total) * 100).toFixed(1);
                const rateStr = rate + '%';
                tableRows.push(`${name} | ${request} | ${fail} | ${lhr} | ${excluded} | ${total} | ${rateStr}`);
                totalRequest += request;
                totalFail += fail;
                totalLhr += lhr;
                totalExcluded += excluded;
            } else {
                const total = request + fail;
                const rate = ((fail / total) * 100).toFixed(1);
                const rateStr = rate + '%';
                tableRows2.push(`${name} | ${request} | ${fail} | ${rateStr}`);
                totalRequest2 += request;
                totalFail2 += fail;
            }
        }
    });

    if (isPassRate) {
        if (!tableRows.length) {
            alert('検品合格率の入力欄に表組にできる内容がありません');
            return;
        }

        averagePassingRate = parseInt(((totalFail / (totalRequest + totalFail + totalLhr + totalExcluded)) * 100).toFixed(1));
        const totalRow = `総計|${totalRequest}|${totalFail}|${totalLhr}|${totalExcluded}|${totalRequest + totalFail + totalLhr + totalExcluded}|${averagePassingRate}%`;
        tableRows.push(totalRow);
        passResult = checkPassingRate(averagePassingRate);

        return tableRows;
    } else {
        if (!tableRows2.length) {
            alert('依頼不備率の入力欄に表組にできる内容がありません');
            return;
        }

        averageDefectRate = parseInt(((totalFail2 / totalRequest2) * 100).toFixed(1));
        const totalRow2 = `総計|${totalRequest2}|${totalFail2}|${averageDefectRate}%`;
        tableRows2.push(totalRow2);
        failResult = checkDeficiencyRate(averageDefectRate);

        return tableRows2;
    }
}

function generatePassRateTable(title, rows) {
    if (!tableRows.length) {
        return;
    }

    const tableHeader = '氏名 | あり | なし | あり（LHR未達） | 対象外 | 総計 | 修正なし（%）';
    const separator = '------------- | ------------- |';

    return `# ${title}<br>${tableHeader}<br>${separator}<br>${rows.join('<br>')}`;
}

function generateFailRateTable(title, rows) {
    if (!tableRows2.length) {
        return;
    }

    const tableHeader = '氏名 | 依頼数 | 不備数 | 不備率（%）';
    const separator = '------------- | ------------- |';
    return `# ${title}<br>${tableHeader}<br>${separator}<br>${rows.join('<br>')}`;
}

function checkPassingRate(averagePassingRate) {
  if (averagePassingRate >= 65) {
    return "**基準値達成！素晴らしい！！**";
  } else {
    return "**残念、未達成！**";
  }
}

function checkDeficiencyRate(averageDefectRate) {
  if (averageDefectRate <= 15) {
    return "**基準値達成！素晴らしい！！**";
  } else {
    return "**残念、未達成！**";
  }
}

// 次回の水曜日の日付を計算
function getNextWednesdayDate() {
    const currentDate = new Date();
    // 現在の曜日を取得（0: 日曜日, 1: 月曜日, ..., 6: 土曜日）
    const currentDay = currentDate.getDay();

    // 次回の水曜日までの日数を計算
    const daysUntilNextWednesday = (3 - currentDay + 7) % 7;

    // 次回の水曜日の日付を計算
    const nextWednesdayDate = new Date(currentDate);
    nextWednesdayDate.setDate(currentDate.getDate() + daysUntilNextWednesday);

    // 月と日を取得
    const month = (nextWednesdayDate.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるため+1が必要
    const day = nextWednesdayDate.getDate().toString().padStart(2, '0');

    // "mm/dd" の形式に整形
    const formattedDate = `${month}/${day}`;

    return formattedDate;
}

// スムーススクロールの関数
function smoothScroll(content, duration) {
    const targetElement = content;

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