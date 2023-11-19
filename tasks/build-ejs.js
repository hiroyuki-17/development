import {spawn} from 'child_process';
import path from 'path';
import {fileURLToPath} from 'url';
import {assetsSettings} from '../config.js';

const {
    assets,
    documentRoot,
} = assetsSettings;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isModeDebug = process.env.DEBUG_ENV === 'true';

/**
 * @type {string[]} 実行するコマンドのコマンドライン引数
 */
const chellArgs = [
    '@11ty/eleventy',
    '--config=.eleventy.cjs',
    `--input=${assets.ejs}`,
    `--output=${documentRoot}`,
];

if (isModeDebug) {
    chellArgs.push('--watch', '--incremental', '--quiet');
}

/**
 * EJSビルドの実行(eleventyを使用)
 *
 * @see {@link https://www.11ty.dev/docs/usage/}
 */
const childProcess = spawn('npx', chellArgs, {
    cwd: path.resolve(__dirname, '../'),
    stdio: 'inherit',
    shell: true,
});

childProcess.on('close', (code) => {
    if (code !== 0) {
        console.log(`[Task Failed] EJS Build with Code : ${code}`);
        process.exit(-1);
    }

    console.log('[Task Complete] EJS Build');
});
