/*
 * ----------------------------------------------------------------------------------
 * Live Reload
 * ----------------------------------------------------------------------------------
 */

(async () => {
    const browser = require('browser-sync').create();
    const path = require('path');

    const {assetsSettings} = await import('./config.js');
    const {
        documentRoot,
    } = assetsSettings;

    /**
     * @type {import('browser-sync').Options}
     */
    const bsOption = {
        files: [
            `${documentRoot}/**/*.css`,
            `${documentRoot}/**/*.js`,
            `${documentRoot}/**/*.html`,
        ],
        startPath: '/index.html', /** 立ち上げ時初回に開くパス指定 */
        server: {
            baseDir: documentRoot,
            directory: true,
            index: 'index.html',
            middleware: [
                require('connect-ssi')({
                    baseDir: path.join(__dirname, documentRoot),
                    ext: '.html',
                }),
            ],
        },
    };

    browser.init(bsOption);
})();
