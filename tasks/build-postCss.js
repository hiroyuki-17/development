import {spawn} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';
import {assetsSettings} from '../config.js';

const {
    documentRoot,
} = assetsSettings;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @type {string[]} 実行するコマンドのコマンドライン引数
 */
const chellArgs = [
    `${documentRoot}/**/*.css`,
    '--base', // 階層構造を保ったままビルドするために指定している
    `${documentRoot}`,
    '--dir',
    `${documentRoot}`,
    '--no-map',
    '--verbose',
];

/**
 * postCSSビルドの実行
 *
 * ※ NOTE： postCSSビルドを実行してから静的リソースのビルドを実行する(npm-scripts側で調整)
 *
 * @see {@link https://github.com/postcss/postcss-cli}
 */
const childProcess = spawn('postcss', chellArgs, {
    cwd: path.resolve(__dirname, '../'),
    stdio: 'inherit',
    shell: true,
});

childProcess.on('close', (code) => {
    if (code !== 0) {
        console.log(`[Task Failed] postCSS Build with Code : ${code}`);
        process.exit(-1);
    }

    console.log('[Task Complete] postCSS Build');
});
