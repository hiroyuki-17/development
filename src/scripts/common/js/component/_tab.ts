import {ScrollToTarget} from '../component/_scrollToTarget.js';
import {getRandomId} from '../_utility/_utility.js';
/**
 * タブ生成クラス
 *
 * @export
 * @class Tab
 */
export class Tab {
    /** タブ制御のroot要素 */
    private tabRoot: HTMLElement;
    private tabList: HTMLElement | null;
    private tabTriggers: HTMLAnchorElement[];
    private tabPanels: HTMLElement[];
    private currentIndex: number;
    private className: {
        open: string,
    };

    /**
     * Tabコンストラクタ
     * @param {HTMLElement} tabRoot
     */
    constructor(propTabRoot: HTMLElement) {
        this.tabRoot = propTabRoot;
        this.tabList = null;
        this.tabTriggers = [];
        this.tabPanels = [];
        this.currentIndex = 0;
        this.className = {
            open: 'is-current',
        };
    }

    /**
     * 生成時に実行するメインメソッド
     */
    init() {
        if (!this.tabRoot) {
            return;
        }

        this.tabList = <HTMLElement> this.tabRoot.querySelector(':scope .js-tab-list');
        this.tabTriggers = <HTMLAnchorElement[]>[...this.tabRoot.querySelectorAll(':scope .js-tab-trigger')];
        this.tabPanels = <HTMLElement[]>[...this.tabRoot.querySelectorAll(':scope .js-tab-panel')];

        if (!this.tabList || this.tabTriggers.length === 0 || this.tabPanels.length === 0) {
            return;
        } else if (this.tabTriggers.length !== this.tabPanels.length) {
            throw new Error(`展開するタブのボタンと、対応するパネルの数は一致させる必要があります\n${this.tabRoot.outerHTML}`);
        }

        this.set11yAttribute();
        this.bindEvent();
    }

    bindEvent() {
        const lastIndex = this.tabTriggers.length - 1;

        this.tabTriggers.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                this.open(tab);
            });

            tab.addEventListener('keydown', (e) => {
                switch (e.key) {
                case 'ArrowRight':
                    if (this.currentIndex >= lastIndex) {
                        this.currentIndex = 0;
                    } else {
                        this.currentIndex++;
                    }

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;

                case 'ArrowLeft':
                    if (this.currentIndex <= 0) {
                        this.currentIndex = lastIndex;
                    } else {
                        this.currentIndex--;
                    }

                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;

                case 'Home':
                    this.currentIndex = 0;
                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;

                case 'End':
                    this.currentIndex = lastIndex;
                    e.preventDefault();
                    this.open(this.tabTriggers[this.currentIndex]);
                    break;
                default:
                    break;
                }
            });
        });

        window.addEventListener('load', this.openTabFromHash.bind(this));
    }

    set11yAttribute() {
        const tabRootId = `tab-${getRandomId()}`;

        this.tabRoot.setAttribute('id', tabRootId);
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

            tab.setAttribute('id', `${tabRootId}-trigger-${index + 1}`);
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', ID.replace('#', ''));
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');

            this.tabPanels[index].setAttribute('aria-labelledby', `${tabRootId}-trigger-${index + 1}`);


            if (tab.classList.contains(this.className.open)) {
                const targetTabPanel = <HTMLElement>document.querySelector(ID);

                if (targetTabPanel) {
                    tab.ariaSelected = 'true';
                    targetTabPanel.style.display = '';
                    tab.tabIndex = 0;
                    this.currentIndex = index;
                }
            }
        });

        if (!this.tabList) {
            return;
        }

        [...this.tabList.children].forEach((child) => {
            const {nodeName} = child;

            if (nodeName === 'A') {
                return;
            }

            child.setAttribute('role', 'presentation');
        });
    }

    /**
     * 引数で指定した要素に対応したタブ展開要素を開きます
     *
     * @param {HTMLAnchorElement} tabTrigger
     */

    open(tabTrigger: HTMLAnchorElement) {
        const ID = tabTrigger.getAttribute('href');

        if (!ID) {
            return;
        }

        const targetTabPanel = <HTMLElement>document.querySelector(ID);

        if (!targetTabPanel || tabTrigger.ariaSelected === 'true') {
            return;
        }

        this.resetStatus();
        this.currentIndex = this.tabTriggers.indexOf(tabTrigger);
        tabTrigger.classList.add(this.className.open);
        tabTrigger.ariaSelected = 'true';
        tabTrigger.tabIndex = 0;
        tabTrigger.focus({preventScroll: true});
        targetTabPanel.style.display = '';
    }

    resetStatus() {
        this.tabTriggers.forEach((tab, index) => {
            tab.classList.add(this.className.open);
            tab.ariaSelected = 'false';
            tab.tabIndex = -1;
            tab.classList.remove(this.className.open);

            this.tabPanels[index].style.display = 'none';
        });
    }

    openTabFromHash() {
        const {hash} = window.location;

        if (!hash) {
            return;
        }

        const [targetTrigger] = this.tabTriggers.filter((tabTrigger) => {
            const href = tabTrigger.getAttribute('href');

            return href === hash;
        });

        if (!targetTrigger) {
            return;
        }

        const scroll = new ScrollToTarget();

        this.open(targetTrigger);

        window.requestAnimationFrame(() => {
            scroll.scrollToTarget(targetTrigger);

            window.removeEventListener('load', this.openTabFromHash.bind(this));
        });
    }
}
