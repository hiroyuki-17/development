# 開発者向け情報

## 事前準備
以下の環境を事前に準備します。

|項目|バージョン|備考|
|:--|:--|:--|
|Node.js|18.16.0|必要に応じて、Nodeのバージョン切り替えを行ってください|
|NPM|9.5.1|同上|
|VSCode ※||※ 各自他のエディタを利用しても構いませんが、その場合後述の拡張機能を各自でインストールしてから案件の作業を進めてください|

### 拡張機能のインストール

※ すでにインストール済みであれば不要です。

|項目|備考|
|:--|:--|
|[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)|JSのリンター拡張機能|
|[StyleLint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)|CSSやSCSSのリンター拡張機能|
|[EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)|エディターの設定をある程度統一させる機能を有効化する拡張機能|
|[Textlint](https://marketplace.visualstudio.com/items?itemName=taichi.vscode-textlint)|テキストのリンター機能|

## 使用方法
リポジトリクローン後、以下のコマンドを実行して開発環境をインストールします

### インストール

```shell
npm ci
```

### 開発をスタートする

開発をスタートする場合は以下のコマンドを実行します。

```shell
npm run start
```

## 開発環境構成

```
/ProjectRoot
│
├─/src /** 開発リソース編集領域 **/
│  │─/ejs /** コンパイル対象EJSファイル格納領域 **/
│  │  │─/_data /** ejsビルドで参照されるデータ領域ファイル **/
│  │  │─/_includes /** ejsビルドで参照されるejs共通ファイルやレイアウトファイル領域 **/
│  │  │  ├─/layouts /** ejsのFrontmatterで活用するレイアウトファイル領域 **/
│  │  │  │
│  │─/scripts /** 開発JSソース格納場所（TypeScript） **/
│  │─/scss /** コンパイル対象SCSSファイル格納領域 **/
│  │─/media /** 圧縮・非圧縮画像リソース格納領域 **/
│  │─/static /** ビルドプロセスを通さずにpublic配下に直接出力する静的なリソース格納領域(HTML/CSS/JS/画像など) **/
│  │
/public /** 公開領域（ビルド後の成果物出力領域 : ドキュメントルート） **/
│  ├─index.html
│  ├─favicon.ico
│
```

### /src配下について
- **/src配下のリソースはビルドプロセスを通して、/public配下に出力される**
- 開発リソースを集約する領域とする
- 関係者が編集するリソースはこの領域下で、作業を行うものとする

#### 開発リソースの出力先

基本的に、`/src/`配下の各ディレクトリ（`/media/`, `/scripts/`, `/scss/`, `/static/`, `/ejs/`）をルートとして、  
`/public/`配下に階層を保ったまま出力します。

- ※ `/scss/`配下のパーシャルファイルはビルド後の出力対象外になります（import用途のscssファイル）
- ※ `/ejs/`配下の`_includes`配下のejsファイルはejsでのインクルード用途ファイルを集約させます
- ※ `/scripts/`配下の`_（アンダースコア）`が先頭につくJSファイルはビルド後の出力対象外になります（import用途のJSファイル）

### /public配下について
- **nadeshikoや本番環境にアップされるものとなるリソースファイル**
    - CIにより自動アップロードされます。手動でのnadeshikoへのFTPアップはできません
- **直接編集を禁ずる領域とする**
  - ビルドコマンドなど何かしらの開発コマンドを通してファイルは生成されるものとする
- 最終的なサイトルートの成果物が配置されるファイル

## 用意済みコマンド一覧
あらかじめ以下のnpm scriptsを用意しています。必要に応じて使ってください。

<details><summary>用意済みコマンドを確認する</summary><div>

|  コマンド  |  詳細  |
| ---- | ---- |
| start | 通常の開発コマンド。 全ての開発リソースをビルドし変更を監視します。 |
| server | ローカルサーバーを立ち上げます（※ 単体で使用する想定はない） |
| deploy | 納品ファイルをパブリッシュします |
| clean | 公開領域のディレクトリを削除します |
| build | 開発リソースをすべてビルドします |
| build:* | それぞれの開発リソースを個別にビルドします |
| watch:* | それぞれの開発リソースを個別にビルドします、ビルド後変更を監視します |
| lint | 各種開発リソースのリンターをまとめて実行します |
| lint:* |  それぞれの開発リソースに対してリンターを実施します |
| vlint:html | htmlファイルの`vlint`チェックを実行します |
| vlint:css | cssファイルの`vlint`チェックを実行します |
| vlint:ignore:html | `vlint`の無視するエラーリスト（html）を作成・更新します。|
| vlint:ignore:css | `vlint`の無視するエラーリスト（css）を作成・更新します。|

</div></details>

## 備考

- [画像圧縮のパッケージ](https://github.com/imagemin/imagemin)は以下を使用しているため、オプションの編集を行う場合は参照してください。  
編集を行う場合は、`tasks/build-imagemin.js`内に記述されている画像圧縮タスクの関数スコープから行います。
    - JPEG : [jpegtran](https://github.com/imagemin/imagemin-jpegtran)
    - PNG  : [optipng](https://github.com/imagemin/imagemin-optipng)
    - GIF  : [gifsicle](https://github.com/imagemin/imagemin-gifsicle)
    - SVG  : [svgo](https://github.com/imagemin/imagemin-svgo)
