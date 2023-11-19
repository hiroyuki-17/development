import path from 'path';
import fs from 'fs/promises';
import {assetsSettings} from '../config.js';

const {
    documentRoot,
} = assetsSettings;

(async () => {
    console.log(`[Build] ビルド実行前に、"${path.resolve(documentRoot)}"を削除しています...`);

    await fs.rm(documentRoot, {
        recursive: true,
        force: true,
    });

    console.log(`[Build] "${path.resolve(documentRoot)}"配下の削除が完了しました。`);
})();
