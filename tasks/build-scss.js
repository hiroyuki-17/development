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
    `${assets.scss}:${documentRoot}`,
    '--style=expanded',
];

if (isModeDebug) {
    chellArgs.push('--watch');
    chellArgs.push('--embed-sources');
} else {
    chellArgs.push('--no-charset');
    chellArgs.push('--no-source-map');
}

/**
 * SCSSビルドの実行
 *
 * @see {@link https://sass-lang.com/documentation/cli/dart-sass}
 */
const childProcess = spawn('sass', chellArgs, {
    cwd: path.resolve(__dirname, '../'),
    stdio: 'inherit',
    shell: true,
});

childProcess.on('close', (code) => {
    if (code !== 0) {
        console.log(`[Task Failed] Scss Build with Code : ${code}`);
        process.exit(-1);
    }

    console.log('[Task Complete] Scss Build');
});
