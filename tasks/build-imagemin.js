import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import {watch} from 'chokidar';
import path from 'path';
import {glob} from 'glob';
import {assetsSettings} from '../config.js';

const isModeDebug = process.env.DEBUG_ENV === 'true';
const {
    assets,
    documentRoot,
} = assetsSettings;
const targetInput = glob.sync(`${assets.media}/**/*.*`);

const imageminPluginSettings = [
    imageminOptipng({
        optimizationLevel: 3,
    }),
    imageminJpegtran(),
    imageminGifsicle(),
    imageminSvgo({
        plugins: [
            'preset-default',
            'convertStyleToAttrs',
            {
                name: 'removeAttrs',
                params: {
                    // SVG内の不要な属性を削除するパターンを指定
                    attrs: [
                        'data-name',
                    ],
                },
            },
        ],
    }),
];

/**
 * 通常のimageminだと階層を保って画像を出力できないので、それを実現するパイプ関数。同時に非圧縮画像の出力も行います。
 *
 * @param {string} imageFilePath imageminでビルドする画像のパス
 * @returns {Promise<import('imagemin').Result[]>}
 * @see {@link https://github.com/imagemin/imagemin}
 */
const pipeImagemin = (imageFilePath) => {
    let splitArray = imageFilePath.split(path.sep);
    const input = [imageFilePath];

    if (!imageFilePath.includes(path.sep)) {
        splitArray = imageFilePath.split('/');
    }

    // ex) /hoge/piyo/fuga/sample.jpg → /hoge/piyo/fuga/
    splitArray.pop();

    /**
     * 圧縮しない画像を吐き出す
     * ※ 圧縮しない画像は同階層にstaticディレクトリを作成し画像を配置→処理内でその上の階層に画像を出力
     */
    if (splitArray.indexOf('static') > 0) {
        // ex) /hoge/piyo/fuga/static/ → /hoge/piyo/fuga/
        const destDirectoryStatic = splitArray.filter((dir) => dir !== 'static');

        console.log(`[Task Imagemin] Passthrough Image File : ${input}`);

        return imagemin(input, {
            destination: destDirectoryStatic.join('/').replace(assets.media.replace(/^\.\//gu, ''), documentRoot),
        });
    }

    const destDirectory = splitArray.join('/');

    return imagemin(input, {
        destination: destDirectory.replace(assets.media.replace(/^\.\//gu, ''), documentRoot),
        plugins: imageminPluginSettings,
    });
};

(async () => {
    const queBuild = targetInput.map((file) => pipeImagemin(file));

    console.log('[Task imagemin] Starting imagemin build...');

    await Promise.all(queBuild).then((results) => {
        console.log(`[Task Complete] imagemin Build. [Result : ${results.length} Files]`);
    }).catch((e) => {
        console.log(e);
        console.log('[Task Failed] imagemin Build');
        process.exit(-1);
    });

    // 開発中に変更監視を実施
    if (isModeDebug) {
        /**
         * 変更監視を登録 chokidarパッケージに依存
         * @see {@link https://github.com/paulmillr/chokidar}
         */
        const watcher = watch(`${assets.media}/**/*.*`);

        watcher.on('ready', () => {
            console.log('[Task imagemin] waching for changes...');

            watcher.on('add', (filepath) => {
                pipeImagemin(filepath).then(() => {
                    console.log(`[Task imagemin:watch] imagemin build complete. ${filepath}`);
                }).catch((e) => {
                    console.log(e);
                });
            });

            watcher.on('change', (filepath) => {
                pipeImagemin(filepath).then(() => {
                    console.log(`[Task imagemin:watch] imagemin build complete. ${filepath}`);
                }).catch((e) => {
                    console.log(e);
                });
            });
        });
    }
})();
