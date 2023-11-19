/**
 * 11tyの設定
 */
module.exports = function () {
    return {
        "htmlTemplateEngine": "ejs",
        "markdownTemplateEngine": "ejs",
        "templateFormats": ["html", "ejs"],
        // NOTE : input, outputはコマンドライン引数から指定しているのでここでは指定しない
    }
};
