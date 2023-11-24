import {
    disableBodyScroll,
    restrictFocus,
} from '/common/js/_utility/_utility.js';

import {mqlHeader, langType} from '/common/js/header/_headerSetting.js';
import {HeaderDropdown} from '/common/js/header/_headerDropdown.js';
import {HeaderSearch} from '/common/js/header/_headerSearch.js';
import {HeaderSpMove} from '/common/js/header/_headerSpMove.js';
import {HeaderTab} from '/common/js/header/_headerTab.js';
import {HeaderFontsizeChange} from '/common/js/header/_headerFontsizeChange.js';

const dropDownInstances: HeaderDropdown[] = [];

const tabRoots = document.querySelectorAll<HTMLElement>('.js-gnav-tab');

tabRoots.forEach((tabRoot) => {
    const tab = new HeaderTab(tabRoot);

    tab.init();
});

/**
 * ヘッダーのJS制御をコントロールする
 *
 * @export
 * @class HeaderControl
 */
export class HeaderControl {
    /** 共通ヘッダー要素 */
    private html: HTMLElement;
    /** 共通ヘッダー要素 */
    public header: HTMLElement;
    /** ヘッダー制御のブレイクポイント設定 */
    private mql: MediaQueryList;
    /** ヘッダーサイト内検索エリア展開ボタン */
    private btnSearch: HTMLAnchorElement;
    /** SPグロナビ展開ボタン */
    private btnSpGnav: HTMLButtonElement;
    private btnSpGnavText: HTMLElement;
    /** サブメニュー展開ボタントリガー（PC: ドロップダウン, SP: トグルメニュー） */
    private menuTrigger: NodeListOf<HTMLButtonElement>;
    /** 第4階層展開ボタントリガー */
    private gnavTabTrigger: NodeListOf<HTMLAnchorElement>;
    /** ヘッダーサイト内検索エリア */
    private searchArea: HTMLElement;
    /** SPメニューエリア */
    private spMenuArea: HTMLElement;
    /** ヘッダー検索input要素 */
    private searchInput: HTMLInputElement;
    /** オーバーレイスタイル用クラス名 */
    private headerOverlayClass: string;
    /** SPグロナビが展開状態かどうか */
    private isGnavOpen: boolean;
    /** "headerReset"イベントを発行するカスタムイベント */
    private resetEvent: CustomEvent;
    private gnavDebounceHeight: number;
    /** 文字サイズ変更ボタン */
    private btnChangeFontSize: NodeListOf<HTMLButtonElement>;
    /** ヘッダー上部の戻るボタン */
    public headerBtnBack: HTMLElement;
    /** SP時のみ表示されるボタンエリア */
    public spSubContentArea: HTMLElement;

    constructor() {
        this.html = <HTMLElement>document.querySelector('html');
        this.header = <HTMLElement>document.querySelector('.str-header');
        this.mql = mqlHeader;
        this.btnSearch = <HTMLAnchorElement>document.querySelector('.js-header-search-trigger');
        this.btnSpGnav = <HTMLButtonElement>document.querySelector('.js-header-sp-gnav-trigger');
        this.btnSpGnavText = <HTMLElement>document.querySelector('.js-header-sp-gnav-trigger-label');
        this.menuTrigger = document.querySelectorAll<HTMLButtonElement>('.js-header-menu-trigger');
        this.gnavTabTrigger = document.querySelectorAll<HTMLAnchorElement>('.js-gnav-tab-trigger');
        this.searchArea = <HTMLElement>document.querySelector('.js-header-search');
        this.spMenuArea = <HTMLElement>document.getElementById('js-header-sp-menu');
        this.searchInput = <HTMLInputElement>document.querySelector('.js-header-search-input');
        this.resetEvent = new CustomEvent('headerReset');
        this.headerOverlayClass = 'is-overlay';
        this.isGnavOpen = false;
        this.gnavDebounceHeight = 64;
        this.btnChangeFontSize = document.querySelectorAll<HTMLButtonElement>('.js-change-font-size-btn');
        this.headerBtnBack = <HTMLElement>document.querySelector('.str-header__btn-back');
        this.spSubContentArea = <HTMLElement>document.querySelector('.str-header-subcontent-sp');
    }

    init() {
        if (!this.header) {
            return;
        }

        this.prepareControl();
        this.mql.addListener(this.breakPointControl.bind(this));
    }

    /**
     * 各制御の初回の呼び出し及び、必要な属性値のセットを行う
     *
     * @memberof HeaderControl
     */
    prepareControl() {
        if (this.btnSpGnav && this.spMenuArea) {
            this.insertGnavCloseBtnToGnavArea();

            this.btnSpGnav.setAttribute('aria-controls', this.spMenuArea.id);
            this.btnSpGnav.setAttribute('aria-expanded', 'false');

            this.btnSpGnav.addEventListener('click', () => {
                if (this.isGnavOpen) {
                    this.gnavClose();

                    return;
                }

                this.gnavOpen();
            });
        }

        if (this.gnavTabTrigger) {
            this.gnavTabTrigger.forEach((trigger) => {
                // トリガーが持つhrefの値を取得
                const targetId = trigger.getAttribute('href');

                if (targetId === null) {
                    return;
                }

                const targetContent = <HTMLElement>document.querySelector(targetId);
                const headerSpMove = new HeaderSpMove(trigger, targetContent, this);

                headerSpMove.init();
            });
        }


        if (this.menuTrigger) {
            this.menuTrigger.forEach((trigger, index) => {
                const nextElement = <HTMLElement>trigger.nextElementSibling;
                const ID = `header-menu-${Date.now()}-${index + 1}`;

                if (!nextElement) {
                    return;
                }

                trigger.setAttribute('aria-controls', ID);
                trigger.setAttribute('aria-expanded', 'false');
                nextElement.setAttribute('id', ID);

                const instanceDropDown = new HeaderDropdown(trigger, nextElement);
                const headerSpMove = new HeaderSpMove(trigger, nextElement, this);

                // PCドロップダウンの制御
                instanceDropDown.init();

                // SP時のナビゲーション移動制御
                headerSpMove.init();

                dropDownInstances.push(instanceDropDown);

                trigger.addEventListener('click', () => {
                    if (this.mql.matches) {
                        return;
                    }

                    for (const dropDownInstance of dropDownInstances) {
                        if (trigger !== dropDownInstance.trigger) {
                            // PCドロップダウンメニュー 開いたボタン以外のメニューをすべて閉じる
                            dropDownInstance.close();
                        }
                    }

                    if (instanceDropDown.trigger.ariaExpanded === 'true') {
                        instanceDropDown.header.classList.add(instanceDropDown.overlayVisibleStatusClass);
                    }
                });
            });
        }

        if (this.searchArea && this.btnSearch && this.searchInput) {
            this.btnSearch.setAttribute('aria-controls', this.searchArea.id);
            this.btnSearch.setAttribute('aria-expanded', 'false');
            this.btnSearch.addEventListener('click', () => {
                if (this.mql.matches) {
                    return;
                }

                // ヘッダー検索エリア展開時にドロップダウンメニューをすべて閉じる
                for (const dropDownInstance of dropDownInstances) {
                    dropDownInstance.close();
                }
            });

            // ヘッダー検索エリア・ボタン制御
            const headerSearch = new HeaderSearch(this.btnSearch, this.searchArea, this.searchInput);

            headerSearch.init();
        }

        const headerFontsizeChange = new HeaderFontsizeChange(this.btnChangeFontSize);

        headerFontsizeChange.init();
    }

    /**
     * SPメニューエリアのスクロール位置を調整する
     */
    spGnavMenuScrollToInnerTop() {
        if (!this.mql.matches) {
            return;
        }

        const menuInnerScrollTop = this.spMenuArea.scrollTop;

        if (menuInnerScrollTop === 0) {
            return;
        }

        this.spMenuArea.scroll(0, 0);
    }

    /**
     * グロナビ展開先メニューエリア末尾に閉じるボタンを挿入する
     *
     * @memberof HeaderControl
     */
    insertGnavCloseBtnToGnavArea() {
        if (this.spMenuArea.querySelector('.str-header__btn-close-bottom')) {
            return;
        }

        const closeBtn = document.createElement('button');

        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('class', 'str-header__btn-close-bottom');
        closeBtn.setAttribute('aria-controls', this.spMenuArea.id);

        closeBtn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;

        closeBtn.addEventListener('click', () => {
            this.gnavClose();
            this.btnSpGnav.focus({
                preventScroll: true,
            });
        });

        this.spMenuArea.append(closeBtn);
    }

    /**
     * ブレイクポイントの切り替わりに応じたリセット処理を行う
     *
     * @memberof HeaderControl
     */
    breakPointControl() {
        // this.prepareControl();

        if (this.btnSpGnav && this.spMenuArea) {
            this.gnavClose();
            this.spMenuArea.style.display = '';

            if (this.html.classList.contains('font-large')) {
                this.html.classList.remove('font-large');
                this.btnChangeFontSize.forEach((elem) => {
                    elem.classList.remove('is-selected');
                });

                this.btnChangeFontSize[0].classList.add('is-selected');
            }
        }

        window.dispatchEvent(this.resetEvent);
    }

    /**
     * SPグロナビメニュー全体を開きます
     */
    gnavOpen() {
        if (this.isGnavOpen) {
            return;
        }

        this.isGnavOpen = true;
        this.btnSpGnav.ariaExpanded = 'true';
        // this.header.classList.add(this.headerOverlayClass);
        this.spMenuArea.classList.add('is-gnav-show');
        disableBodyScroll(true);
        restrictFocus(this.header, true);

        if (this.btnSpGnavText) {
            this.btnSpGnavText.textContent = langType === 'ja' ? '閉じる' : 'Close';
        }

        this.spMenuArea.style.height = `${window.innerHeight - this.gnavDebounceHeight}px`;
        this.spMenuArea.style.display = 'flex';
        this.spSubContentArea.style.display = 'block';

        if (document.querySelector('.is-open-move')) {
            this.headerBtnBack.classList.add('is-visible');
            this.headerBtnBack.style.display = 'block';
        }
    }

    /**
     * SPグロナビメニュー全体を閉じます
     */
    gnavClose() {
        this.isGnavOpen = false;
        this.btnSpGnav.ariaExpanded = 'false';
        this.header.classList.remove(this.headerOverlayClass);
        this.spMenuArea.classList.remove('is-gnav-show');
        disableBodyScroll(false);
        restrictFocus(this.header, false);

        if (this.btnSpGnavText) {
            this.btnSpGnavText.textContent = langType === 'ja' ? 'メニュー' : 'Menu';
        }

        this.headerBtnBack.classList.remove('is-visible');
        this.headerBtnBack.removeAttribute('style');
        this.spGnavMenuScrollToInnerTop();
        this.spMenuArea.style.height = '';
        this.spMenuArea.style.display = '';
    }
}
