const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const cssSorter = require('css-declaration-sorter');
const sortMedia = require('postcss-sort-media-queries');
const header = require('postcss-header');

module.exports = {
    plugins: [
        header({
            header: '@charset "UTF-8";\n',
        }),
        cssSorter({
            order: 'smacss',
        }),
        autoprefixer(),
        // メディアクエリをまとめる
        sortMedia(),
        // CSS圧縮
        cssnano(),
    ],
};
