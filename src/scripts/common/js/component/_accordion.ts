import {MQL} from '/common/js/_utility/_utility.js';
import {Toggle} from '/common/js/component/_toggle.js';
import {ScrollToTarget} from '/common/js/component/_scrollToTarget.js';
import {langType} from '/common/js/header/_headerSetting.js';

interface AccordionOption {
    className: {
        closeBtn: string,
    }
}

const defaultOption: AccordionOption = {
    className: {
        closeBtn: 'm-toggle__close',
    },
};

/**
 * アコーディオン開閉を制御します
 *
 * @export
 * @class Accordion
 */
export class Accordion {
    /** アコーディオンで制御するルートとなる要素 */
    private root: HTMLElement;
    /** アコーディオンで制御するルートとなる要素内にあるトリガー要素 */
    private triggers: NodeListOf<HTMLButtonElement>;
    /** ルート要素内に存在するトグルアイテム */
    private toggleItems: Toggle[];
    private option: AccordionOption;
    private mql: MediaQueryList;

    constructor(rootElement: HTMLElement, option?: AccordionOption) {
        this.root = rootElement;
        this.toggleItems = [];
        this.triggers = this.root.querySelectorAll('.js-toggle-trigger');
        this.option = {
            ...defaultOption,
            ...option,
        };
        this.mql = MQL;
    }

    init() {
        this.initToggle();
        this.bindEvent();
    }

    /**
     * トグルを構築する
     */
    initToggle() {
        this.triggers.forEach((trigger) => {
            let toggleContent: Element | null = null;
            const parentElement = <HTMLElement>trigger.parentNode;

            if (
                trigger.nextElementSibling &&
                trigger.nextElementSibling.classList.contains('js-toggle-content')
            ) {
                // ボタンの隣接要素がトグルコンテンツ対象だった場合
                toggleContent = trigger.nextElementSibling;
            } else if (
                parentElement &&
                parentElement.nextElementSibling &&
                parentElement.nextElementSibling.classList.contains('js-toggle-content')
            ) {
                // ボタンの親要素との隣接要素がトグルコンテンツ対象だった場合
                toggleContent = parentElement.nextElementSibling;
            }

            if (!toggleContent) {
                return;
            }

            const wrapperElement = trigger.closest('.js-toggle-wrapper');
            const toggle = new Toggle(trigger, <HTMLElement>toggleContent, {
                className: {
                    isOpen: 'is-open',
                },
                wrapperElement: wrapperElement ? <HTMLElement>wrapperElement : null,
            });

            toggle.init();

            this.toggleItems.push(toggle);
            this.insertCloseBtnToContent(toggle);
        });
    }

    /**
     * SP時にトグルトリガー要素までスクロールさせます
     */
    adjustScrollTopOnClose(toggle: Toggle) {
        if (!this.mql.matches) {
            return;
        }

        const scroll = new ScrollToTarget();

        scroll.scrollToTarget(toggle.trigger);
    }

    /**
     * 初回のイベント登録を行います
     */
    bindEvent() {
        if (this.root.dataset.toggle === 'accordion') {
            // アコーディオン開閉モードの制御を登録する
            this.triggers.forEach((trigger) => {
                trigger.addEventListener('click', () => {
                    this.toggleItems.forEach((otherToggle) => {
                        if (otherToggle.trigger === trigger) {
                            return;
                        }

                        otherToggle.close();
                    });
                });
            });
        }
    }

    /**
     * 開閉対象トグルコンテンツ要素末尾に閉じるボタン要素を挿入する
     */
    insertCloseBtnToContent(toggle: Toggle) {
        const closeBtn = document.createElement('button');

        closeBtn.setAttribute('type', 'button');
        closeBtn.innerHTML = `<span><span>${langType === 'ja' ? '閉じる' : 'Close'}</span></span>`;
        closeBtn.classList.add(this.option.className.closeBtn);

        closeBtn.addEventListener('click', () => {
            toggle.close();
            this.adjustScrollTopOnClose(toggle);
        });

        toggle.content.append(closeBtn);
    }
}
