# 作業ルール

ブランチ操作に関するルールを以下に定義していますので  
良く確認し、注意して操作を行うようにしてください。

## ブランチ構成

開発中は`Git-flow`をベースで進めることとします。  
ブランチ構成は以下です。

|ブランチ名|備考|
|:--|:--|
|`main`|最終成果物がマージされる領域|
|`develop`|開発中リソースがマージされる領域|
|`feature/***`|タスクごとの開発を行うために作成されるブランチ|
|`demo`|デモページへアップするためのブランチ|
|`release`|リリース用ブランチ|
|`production`|deployコマンド実行後にパブリッシュされるファイルのプッシュ先ブランチ（直接操作禁止）|

## タスクの進め方

タスク作業を行う場合は、`develop`ブランチから`feature`ブランチを作成して作業を開始します。

1. `develop`ブランチをリモートから`pull`して最新の状態にします
1. `develop`ブランチから`feature/***`ブランチを作成
    - 作業を行う
    - 作業内容をコミット・プッシュする
1. `feature/**`完了後、`develop`ブランチへ内容をマージしてコミット・プッシュ

### demoブランチの操作

デモアップは手動で行わず、自動同期という手段を取ります。  
以下の手順に従って操作を行ってください。

※ demo用にローカルリポジトリを別途クローンしておくとスムーズに作業ができます

1. `demo`ブランチをリモートから`pull`して最新の状態にします
1. `feature/**`ブランチをデモへ反映したいとなった場合は、対象ブランチを`demo`ブランチへマージします
1. CIによる自動の同期・ビルド操作が行われるため、反映されるのを待ちます
    - リポジトリのGitLabページを開き左サイドナビゲーション「CI/CD → Pipelines」ページを見るとステータスが確認できます

### 納品段階になったら

※ 事前に、`production`ブランチをクローンしたローカルリポジトリを別で用意してください

1. `develop`ブランチに移動します
1. `develop`ブランチから`release`ブランチを作成します
    - ブランチ名は`release_YYYYMMDD_XX`等で良いです
        - ※ `_XX`部分は連番をイメージしています ex) _01 / _02...
1. `release`ブランチを完了して`main`/`develop`ブランチにマージ・プッシュします
1. `main`ブランチに移動し、`npm run build`コマンドを実行します
    - **必ずビルドコマンドを実行してください。**
1. `main`ブランチで、`npm run deploy`コマンドを実行します
    - **必ず先のビルドコマンドを実行したあとに実行してください。**
1. 実行後、`production`ブランチに`public`配下のファイルがプッシュされるためそちらの差分ファイルをログから抽出して連携します