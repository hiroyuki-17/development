import {exec} from 'child_process';
import {assetsSettings} from './config.js';

const {
    documentRoot,
} = assetsSettings;

// デプロイコマンドを実行する際のターゲットとなる納品ブランチ
const targetBranch = 'main';

/**
 * @returns {Promise<string>} ブランチ名
 */
const getCurrentBranch = () => new Promise((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
        if (err) {
            reject(new Error(`stderr: ${stderr}`));
        }

        resolve(stdout.trim());
    });
});

/**
 * @returns {Promise<string>} 直前のコミットID
 */
const getLatestCommitId = () => new Promise((resolve, reject) => {
    exec('git rev-parse --short HEAD', (err, stdout, stderr) => {
        if (err) {
            reject(new Error(`stderr: ${stderr}`));
        }

        resolve(stdout);
    });
});

/**
 * 納品時にパブリッシュするスクリプト
 */
(async () => {
    try {
        const currentBranch = await getCurrentBranch();
        const latestCommitId = await getLatestCommitId();

        console.log('[INFO] 公開領域へのデプロイの処理を実行します...');
        console.log(`[INFO] 現在のブランチ : "${currentBranch}"`);

        console.log(latestCommitId);

        if (targetBranch !== currentBranch) {
            throw new Error(`[INFO] Deployコマンドは${targetBranch}ブランチに移動してから実行してください。 処理を中断します`);
        }

        console.log('[INFO] 公開領域へのデプロイ処理を実行...');

        /**
         * 公開領域へ対象ファイルをパブリッシュする為のシェルスクリプトコマンド
         * @see {@link https://github.com/tschaub/gh-pages}
         */
        const shellcmd = `gh-pages --dotfiles=true --dist ${documentRoot} --branch production --message "【納品】コミット from ${latestCommitId} の公開領域ファイル分"`;

        exec(shellcmd, (err, stdout, stderr) => {
            if (stdout) {
                console.log(`stdout: ${stdout}`);
                console.log('[INFO] デプロイを実行しました。 公開領域ファイルのブランチを確認ください。');
            }

            if (err) {
                throw new Error(`[INFO] err: ${err}`);
            }

            if (stderr) {
                throw new Error(`[INFO] stderr: ${stderr}`);
            }
        });
    } catch (e) {
        console.error(e);
        process.exit(-1);
    }
})();
