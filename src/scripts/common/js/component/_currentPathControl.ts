
type matcheLinkRule = 'fullpath' | 'directory';

interface CurrentPathControlOption {
    className: {
        isCurrent: string,
    },
    matchRuleType: matcheLinkRule,
}

const defaultOption: CurrentPathControlOption = {
    /** クラス名の指定 */
    className: {
        /** リンクがマッチしたときに付与されるステータスクラス名 */
        isCurrent: 'is-current',
    },
    matchRuleType: 'fullpath',
};

export class CurrentPathControl {
    private targetLinks: NodeListOf<HTMLAnchorElement>;
    private currentPath: string;
    private currentDirectoryPath: string;
    private option: CurrentPathControlOption;

    #matchedLinkeElements: HTMLAnchorElement[];

    constructor(targetLinkItems: NodeListOf<HTMLAnchorElement>, option?: CurrentPathControlOption) {
        this.targetLinks = targetLinkItems;
        this.#matchedLinkeElements = [];
        this.currentPath = window.location.pathname;
        this.currentDirectoryPath = '';
        this.option = {
            ...defaultOption,
            ...option,
        };
    }

    init() {
        this.setCurrentDirectoryPath();
        this.setLinkElementStatus();
    }

    /**
     * パターンマッチしたリンク要素
     *
     * @readonly
     */
    get matchedElements() {
        return this.#matchedLinkeElements;
    }

    /**
     * 現在のディレクトリまでのパス情報をセットする
     *
     * @private
     */
    private setCurrentDirectoryPath() {
        let pathList: string[] | undefined = [];

        pathList = this.currentPath.split('/');

        if (pathList.length >= 2) {
            pathList.pop();
        }

        this.currentDirectoryPath = pathList.join('/');

        if (this.currentDirectoryPath === '') {
            this.currentDirectoryPath = '/';
        } else {
            // ex) "/hoge/piyo/fuga" → "/hoge/piyo/fuga/"
            this.currentDirectoryPath += '/';
        }
    }

    /**
     * パターンにマッチしたリンク要素に対してマッチ後のステータスクラスを付与する
     *
     * @private
     */
    private setLinkElementStatus() {
        this.currentPath = this.currentPath.replace('index.html', '');
        this.targetLinks.forEach((target) => {
            let link = target.getAttribute('href');

            if (!link) {
                return;
            }

            link = link.replace('index.html', '');

            switch (this.option.matchRuleType) {
            case 'fullpath':{
                // ファイル名まで現在のページがマッチするかチェック
                const regexp = new RegExp(`^${link}$`, 'u');

                if (regexp.test(this.currentPath)) {
                    this.#matchedLinkeElements.push(target);
                    target.classList.add(this.option.className.isCurrent);
                }
                break;
            }
            case 'directory':{
                // 現在のページまでのディレクトリがマッチするかチェック
                const regexp = new RegExp(`^${link}`, 'u');

                if (regexp.test(this.currentDirectoryPath) || link.startsWith(this.currentDirectoryPath)) {
                    this.#matchedLinkeElements.push(target);
                    target.classList.add(this.option.className.isCurrent);
                }
                break;
            }
            default:
                break;
            }
        });
    }
}
