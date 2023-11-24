import {HeaderControl} from '/common/js/header/_header';
import {mqlHeader, langType} from '/common/js/header/_headerSetting.js';
import {FOCUS_SELECTOR, setTimeoutAnimationFrame} from '/common/js/_utility/_utility.js';

/**
 * SP時ヘッダーメニューの制御を行う
 *
 * @export
 * @class HeaderSpMove
 */
export class HeaderSpMove {
    /** トリガーとなる要素 */
    public trigger: HTMLButtonElement | HTMLAnchorElement;
    /** 展開先のコンテンツを含む要素 */
    private targetContent: HTMLElement;
    /** ヘッダー制御のブレイクポイント設定 */
    private mql: MediaQueryList;
    private headerControl: HeaderControl;
    private headerBtnBack: HTMLElement;
    private menuInnerBody: HTMLElement;

    constructor(trigger: HTMLButtonElement | HTMLAnchorElement, targetContent: HTMLElement, headerControl: HeaderControl) {
        this.trigger = trigger;
        this.targetContent = targetContent;
        this.mql = mqlHeader;
        this.headerControl = headerControl;
        this.headerBtnBack = this.headerControl.headerBtnBack;
        this.menuInnerBody = <HTMLElement> this.headerControl.header.querySelector('.str-header-body');
    }

    init() {
        this.bindEvent();
    }

    bindEvent() {
        window.addEventListener('headerReset', () => {
            this.resetEvent();
        });

        this.trigger.addEventListener('click', () => {
            // PC時は処理しない
            if (!this.mql.matches) {
                return;
            }

            this.menuShow();

            const isCloseBtn = this.targetContent.querySelector('.str-header__btn-close-bottom');

            if (!isCloseBtn) {
                this.insertCloseBtn();
            }
        });

        this.headerBtnBack.addEventListener('click', () => {
            const showFlg = this.targetContent.classList.contains('is-open-move');

            if (!showFlg) {
                return;
            }

            const nav3Flg = this.targetContent.classList.contains('js-gnav-tab');
            const nav4Flg = this.targetContent.classList.contains('js-gnav-tab-panel');
            const nav4ShowFlg = <HTMLElement> this.targetContent.querySelector('.is-open-move');
            this.targetContent.scrollTop = 0;

            // 第四階層のメニューが非表示もしくは第三・第四階層に対象のclassが存在しない場合、第三階層のメニューを非表示にする
            if ((nav3Flg && !nav4ShowFlg) || (!nav3Flg && !nav4Flg)) {
                this.menuHide();
                this.areaFocusDisable(this.menuInnerBody, 'OFF');
                this.headerControl.spGnavMenuScrollToInnerTop();

                return;
            }

            // 第四階層のメニューが表示されている場合、第四階層のメニューを非表示にする
            if (nav3Flg && nav4ShowFlg) {
                const prevMenu = <HTMLElement> this.targetContent.closest('.is-open-move');

                this.areaFocusDisable(this.menuInnerBody, 'ON');

                if (prevMenu) {
                    this.areaFocusDisable(prevMenu, 'OFF');
                    this.areaFocusDisable(nav4ShowFlg, 'OFF');
                }

                nav4ShowFlg.classList.remove('is-open-move');
                setTimeoutAnimationFrame(() => {
                    nav4ShowFlg.removeAttribute('style');
                }, 1);
                this.headerControl.spGnavMenuScrollToInnerTop();
            }
        });
    }

    menuShow() {
        this.areaFocusDisable(this.menuInnerBody, 'ON');
        this.areaFocusDisable(this.targetContent, 'OFF');

        this.targetContent.style.display = 'flex';
        this.targetContent.scrollTop = 0;
        setTimeoutAnimationFrame(() => {
            this.targetContent.classList.add('is-open-move');
            this.headerControl.spGnavMenuScrollToInnerTop();
        }, 1);
        this.targetContent.style.height = '';
        this.btnBackShow();
        this.headerControl.spSubContentArea.removeAttribute('style');
    }

    menuHide(isResetTiming = false) {
        this.targetContent.classList.remove('is-open-move');
        this.areaFocusDisable(this.menuInnerBody, 'OFF');

        if (!isResetTiming) {
            setTimeoutAnimationFrame(() => {
                this.targetContent.style.display = 'none';
            }, 1);
        } else {
            this.targetContent.style.display = 'none';
        }

        this.btnBackHide();
        this.headerControl.spSubContentArea.style.display = 'block';
    }

    btnBackShow() {
        this.headerBtnBack.classList.add('is-visible');
        this.headerBtnBack.style.display = 'block';
    }

    btnBackHide() {
        this.headerBtnBack.classList.remove('is-visible');
        this.headerBtnBack.style.display = 'none';
    }

    insertCloseBtn() {
        if (this.targetContent.querySelector('.str-header__btn-close-bottom')) {
            return;
        }
        // 閉じるボタンを生成
        const closeBtn = document.createElement('button');

        closeBtn.setAttribute('type', 'button');
        closeBtn.setAttribute('class', 'str-header__btn-close-bottom');
        closeBtn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;
        closeBtn.addEventListener('click', () => {
            this.headerControl.gnavClose();
        });

        // 生成した閉じるボタンを対象の要素に挿入
        this.targetContent.appendChild(closeBtn);
    }

    areaFocusDisable(targetArea: HTMLElement, mode: 'ON' | 'OFF') {
        const focusAbleInArea = targetArea.querySelectorAll(FOCUS_SELECTOR);

        switch (mode) {
        case 'ON':
            focusAbleInArea.forEach((area) => area.setAttribute('tabindex', '-1'));
            break;
        case 'OFF':
            focusAbleInArea.forEach((area) => area.setAttribute('tabindex', '0'));
            break;
        default:
            break;
        }
    }

    resetEvent() {
        if (this.mql.matches) {
            return;
        }

        // PC
        this.menuHide(true);
        if (this.trigger.classList.contains('js-header-menu-trigger')) {
            this.targetContent.style.display = '';
        }
    }
}
