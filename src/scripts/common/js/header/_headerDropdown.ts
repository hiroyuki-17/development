import {mqlHeader, langType} from '/common/js/header/_headerSetting.js';

/**
 * ヘッダードロップダウンメニューの制御を行う
 *
 * @export
 * @class HeaderDropdown
 */
export class HeaderDropdown {
    /** トリガーとなる要素 */
    public trigger: HTMLButtonElement;
    /** 展開先のメニュー要素 */
    private targetMenu: HTMLElement;
    private mql: MediaQueryList;
    /** メニューが展開中かどうか */
    private isOpen: boolean;
    /** メニューが展開中にその要素に付与される展開中ステータスクラス名 */
    private visibleStatusClass: string;
    public overlayVisibleStatusClass: string;
    public header: HTMLElement;

    /**
     * @param {HTMLButtonElement} trigger トリガーとなる要素
     * @param {HTMLElement} targetMenu 展開先のメニュー要素
     */
    constructor(trigger: HTMLButtonElement, targetMenu: HTMLElement) {
        this.trigger = trigger;
        this.targetMenu = targetMenu;
        this.mql = mqlHeader;
        this.isOpen = false;
        this.visibleStatusClass = 'is-dropdown-show';
        this.overlayVisibleStatusClass = 'is-overlay-header';
        this.header = <HTMLElement>document.querySelector('.str-header');
    }

    /**
     * 初回の制御用
     */
    init() {
        if (!this.trigger || !this.targetMenu) {
            return;
        }

        if (this.mql.matches) {
            return;
        }

        this.insertCloseBtnToArea();
        this.bindEvent();
    }

    /**
     * 要素に対してイベントを付与します
     */
    bindEvent() {
        this.trigger.addEventListener('click', (e) => {
            if (this.mql.matches) {
                return;
            }

            if (this.isOpen) {
                this.close();

                return;
            }

            e.stopPropagation();
            this.open();
        });

        this.targetMenu.addEventListener('click', (e) => e.stopPropagation());

        window.addEventListener('headerReset', () => {
            this.resetEvent();
        });

        document.addEventListener('click', () => {
            if (this.mql.matches) {
                return;
            }

            if (this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * ドロップダウンメニュー末尾に閉じるボタンを挿入します
     */
    insertCloseBtnToArea() {
        if (this.targetMenu.querySelector('.str-header-dropdown__btn-close')) {
            return;
        }

        const btn = document.createElement('button');
        const div = document.createElement('div');

        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'str-header-dropdown__btn-close');
        btn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;
        div.setAttribute('class', 'str-header-dropdown__content-bottom');
        div.append(btn);

        btn.addEventListener('click', () => {
            this.close();
            this.trigger.focus({
                preventScroll: true,
            });
        });

        this.targetMenu.append(div);
    }

    /**
     * ドロップダウンを開きます
     */
    open() {
        this.targetMenu.classList.add(this.visibleStatusClass);
        this.trigger.ariaExpanded = 'true';
        this.isOpen = true;
    }

    /**
     * ドロップダウンを閉じます
     */
    close() {
        this.targetMenu.classList.remove(this.visibleStatusClass);
        this.trigger.ariaExpanded = 'false';
        this.isOpen = false;
        this.header.classList.remove(this.overlayVisibleStatusClass);
    }

    resetEvent() {
        this.close();
        this.targetMenu.removeAttribute('style');
        this.header.classList.remove(this.overlayVisibleStatusClass);
    }
}
