const {
    createReadStream,
} = require('fs');
const path = require('path');
const csvParser = require('csv-parser');


/**
 * 11tyの設定
 */
module.exports = function (eleventyConfig) {
    // TODO: siteCataLystTagを埋め込むための参照データ、GA4に移行になった後は不要になる場合下記のaddGlobalData定義を削除
    eleventyConfig.addGlobalData('siteCatalystTagList', async () => {
        const projectRoot = path.resolve('./');
        const csvFilename = 'siteCatalystTagList.csv';
        const data = [];
        const getCSVData = () => new Promise((resolve) => {
            createReadStream(`${projectRoot}/${csvFilename}`).
                pipe(csvParser({
                    headers: false,
                })).
                on('data', (row) => {
                    data.push(row);
                }).
                on('end', () => {
                    resolve(data);
                });
        });
        const csvData = await getCSVData();

        return csvData;
    });

    return {
        "htmlTemplateEngine": "ejs",
        "markdownTemplateEngine": "ejs",
        "templateFormats": ["html", "ejs"],
        // NOTE : input, outputはコマンドライン引数から指定しているのでここでは指定しない
    }
};
