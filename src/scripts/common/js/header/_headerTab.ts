import {setTimeoutAnimationFrame} from '/common/js/_utility/_utility.js';
import {mqlHeader} from '/common/js/header/_headerSetting.js';

interface TabClassName {
    /** タブ展開時のステータスクラス名 */
    open: string,
}

/**
 * タブ生成クラス
 *
 * @export
 * @class HeaderTab
 */
export class HeaderTab {
    /** タブ制御のルート要素 */
    private tabRoot: HTMLElement;
    /** 展開元となるトリガー要素の親要素 */
    private tabList: null | HTMLElement;
    /** 展開元となるトリガー要素配列 */
    private tabTriggers: HTMLAnchorElement[];
    /** 展開対象のタブ要素配列 */
    private tabPanels: HTMLElement[];
    /** 現在開いているタブトリガー要素のインデックス番号 */
    private currentIndex: number;
    private className: TabClassName;
    private mql: MediaQueryList;

    /**
     * Tabコンストラクタ
     * @param {HTMLElement} tabRoot
     */
    constructor(tabRoot: HTMLElement) {
        this.tabRoot = tabRoot;
        this.tabList = null;
        this.tabTriggers = [];
        this.tabPanels = [];
        this.currentIndex = 0;
        this.className = {
            open: 'is-current',
        };
        this.mql = mqlHeader;
    }

    /**
     * 生成時に実行するメインメソッド
     */
    init() {
        if (!this.tabRoot) {
            return;
        }

        // 直下の要素を参照し必要なDOMを取得する
        this.tabList = this.tabRoot.querySelector(':scope .js-gnav-tab-list');
        this.tabPanels = <HTMLElement[]>[...this.tabRoot.querySelectorAll(':scope .js-gnav-tab-panel')];

        if (
            !this.tabList ||
            this.tabPanels.length === 0
        ) {
            return;
        }

        this.tabTriggers = [...this.tabList.querySelectorAll<HTMLAnchorElement>('.js-gnav-tab-trigger')];

        if (
            this.tabTriggers.length === 0 ||
            this.tabTriggers.length !== this.tabPanels.length
        ) {
            return;
        }

        this.set11yAttribute();
        this.bindEvent();

        // タブリストの直下にある子要素がa要素以外だった場合 [role="presentation"]属性を付与する
        [...this.tabList.children].forEach((child) => {
            const {tagName} = child;

            if (tagName === 'A') {
                return;
            }

            child.setAttribute('role', 'presentation');
        });

        this.mql.addEventListener('change', this.controlOnBreakPoint.bind(this));
    }

    /**
     * タブ生成時に、要素に対して必要な属性をセットします
     */
    set11yAttribute() {
        const rootId = `tab-${Date.now()}`;

        this.tabRoot.setAttribute('id', rootId);
        this.tabList?.setAttribute('role', 'tablist');
        this.tabPanels.forEach((panel) => {
            panel.setAttribute('role', 'tabpanel');
            panel.style.display = 'none';
        });

        this.tabTriggers.forEach((tab, index) => {
            const ID = tab.getAttribute('href');

            if (!ID) {
                return;
            }

            tab.setAttribute('id', `${rootId}-trigger-${index + 1}`);
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', ID.replace('#', ''));
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');

            this.tabPanels[index].setAttribute('aria-labelledby', `${rootId}-trigger-${index + 1}`);

            if (tab.classList.contains(this.className.open)) {
                const targetTabPanel = <HTMLElement>document.querySelector(ID);

                if (targetTabPanel) {
                    tab.ariaSelected = 'true';
                    targetTabPanel.style.display = '';
                    tab.tabIndex = 0;
                    this.currentIndex = this.getCurrentIndex(tab);
                }
            }
        });
    }

    /**
     * 初回処理実行時に、要素に対してイベントを設定します
     */
    bindEvent() {
        /** タブパネル要素の一番最後のインデックス番号 */
        const lastIndex = this.tabPanels.length - 1;

        this.tabTriggers.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                this.open(tab);
            });

            tab.addEventListener('keydown', (e) => {
                const {key} = e;

                switch (key) {
                case 'ArrowRight':
                    // 次のタブへ
                    if (this.currentIndex >= lastIndex) {
                        this.currentIndex = 0;
                    } else {
                        this.currentIndex++;
                    }

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;
                case 'ArrowLeft':
                    // 前のタブへ
                    if (this.currentIndex <= 0) {
                        this.currentIndex = lastIndex;
                    } else {
                        this.currentIndex--;
                    }

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;
                case 'End':
                    // 一番最後のタブへ
                    this.currentIndex = lastIndex;

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;
                case 'Home':
                    // 一番最初のタブへ
                    this.currentIndex = 0;

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;
                default:
                    break;
                }
            });
        });

        window.addEventListener('headerReset', () => {
            if (this.mql.matches) {
                return;
            }

            setTimeoutAnimationFrame(() => {
                this.resetStatus();

                const [firstTabTrigger] = this.tabTriggers;
                const [firstTab] = this.tabPanels;

                firstTabTrigger.ariaSelected = 'true';
                firstTabTrigger.tabIndex = 0;
                firstTabTrigger.classList.add(this.className.open);
                firstTab.style.display = '';
                this.currentIndex = 0;
            }, 10);
        });
    }

    controlOnBreakPoint() {
        if (!this.tabList) {
            return;
        }

        if (this.mql.matches) {
            // SP タブのrole等を調整する
            this.tabList.removeAttribute('role');
            this.tabPanels.forEach((panel) => {
                panel.removeAttribute('role');
            });
            this.tabTriggers.forEach((tab) => {
                tab.setAttribute('role', 'button');
                tab.removeAttribute('aria-selected');
                tab.tabIndex = 0;
            });
            [...this.tabList.children].forEach((child) => {
                const {tagName} = child;

                if (tagName === 'A') {
                    return;
                }

                child.removeAttribute('role');
            });

            return;
        }

        // PC タブのrole等を再びセットする
        this.tabList.setAttribute('role', 'tablist');
        this.tabPanels.forEach((panel) => {
            panel.setAttribute('role', 'tabpanel');
        });
        this.tabTriggers.forEach((tab) => {
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1;
        });
        [...this.tabList.children].forEach((child) => {
            const {tagName} = child;

            if (tagName === 'A') {
                return;
            }

            child.setAttribute('role', 'presentation');
        });
    }

    /**
     * 現在展開中のタブトリガー要素のインデックス番号を返却します
     *
     * @param {HTMLAnchorElement} tabTrigger
     * @return {number} 展開中のタブに対応するタブトリガー要素のインデックス番号
     */
    getCurrentIndex(tabTrigger: HTMLAnchorElement) {
        return this.tabTriggers.indexOf(tabTrigger);
    }

    /**
     * タブのステータスをリセットします
     */
    resetStatus() {
        this.tabTriggers.forEach((tab) => {
            tab.ariaSelected = 'false';
            tab.classList.remove(this.className.open);
            tab.tabIndex = -1;
        });
        this.tabPanels.forEach((panel) => {
            panel.style.display = 'none';
        });
    }

    /**
     * 引数で指定した要素に対応したタブ展開要素を開きます
     *
     * @param {HTMLAnchorElement} tabTrigger
     */
    open(tabTrigger: HTMLAnchorElement) {
        const ID = tabTrigger.getAttribute('href');

        if (!ID || this.mql.matches) {
            return;
        }

        const targetTabPanel = <HTMLElement>document.querySelector(ID);

        if (
            !targetTabPanel ||
            tabTrigger.ariaSelected === 'true'
        ) {
            return;
        }

        this.resetStatus();
        this.currentIndex = this.getCurrentIndex(tabTrigger);
        tabTrigger.classList.add(this.className.open);
        tabTrigger.ariaSelected = 'true';
        tabTrigger.tabIndex = 0;
        tabTrigger.focus({preventScroll: true});
        targetTabPanel.style.display = '';
    }
}
