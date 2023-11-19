import fse from 'fs-extra';
import {assetsSettings} from '../config.js';

const {copySync} = fse;
const {
    assets,
    documentRoot,
} = assetsSettings;

// 静的リソースのビルド
try {
    copySync(assets.static, documentRoot, {
        filter(src) {
            return !src.includes('.gitkeep');
        },
    });

    console.log('[Task Complete] Static Resource Build');
} catch (e) {
    console.log(`[Task Failed] Failed to copy directory : ${assets.static}`);
    process.exit(-1);
}
