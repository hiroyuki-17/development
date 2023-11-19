/**
 * @typedef AssetsSettings
 * @property {string} script JS/TypeScriptをバンドル・ビルドするリソース（相対パス）
 * @property {string} scss   SCSSでコンパイルするリソース（相対パス）
 * @property {string} media  画像圧縮対象のリソース（相対パス）
 * @property {string} ejs EJSファイルのリソース（相対パス）
 * @property {string} static 静的リソース（相対パス）
 */

export const assetsSettings = {
    /**
     * 開発リソースの格納先指定（相対パス）
     * @type {Readonly<AssetsSettings>}
     */
    assets: {
        // ※ scriptのパスを調整したら、tsconfig.jsonの設定も合わせて調整する
        script: './src/scripts',
        scss: './src/scss',
        ejs: './src/ejs',
        media: './src/media',
        static: './src/static',
    },
    /**
     * 公開領域へのディレクトリ相対パス
     * ※ .gitignoreでも公開領域の無視指定を行っている為変更する場合は合わせて更新する
     * ※ tsconfig.jsonの設定も合わせて調整する
     * @readonly
     */
    documentRoot: 'public',
    /**
     * ビルドモード（npm scriptsから指定される環境変数）
     * @readonly
     * @type {'production' | 'development'}
     */
    buildMode: process.env.NODE_ENV,
};
