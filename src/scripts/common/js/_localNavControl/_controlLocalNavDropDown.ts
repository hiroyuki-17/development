import {MQL} from '/common/js/_utility/_utility.js';
import {Toggle} from '/common/js/component/_toggle.js';
import {ScrollToTarget} from '/common/js/component/_scrollToTarget.js';
import {langType} from '/common/js/header/_headerSetting.js';

/**
 * 特定配下向け※のローカルナビゲーション制御クラス
 *
 * ※ 「制作はこちら」配下等
 *
 * @export
 * @class LovalNavDropDown
 */
export class ControlLocalNavDropDown {
    private triggers: NodeListOf<HTMLElement>;
    private triggerInstances: Toggle[];
    private btnClassName: string;
    private mql: MediaQueryList;

    constructor(triggers: NodeListOf<HTMLElement>) {
        this.triggers = triggers;
        this.triggerInstances = [];
        this.btnClassName = 'str-nav-local-top-menu__close';
        this.mql = MQL;
    }

    init() {
        this.bindEvent();
    }

    bindEvent() {
        this.triggers.forEach((trigger) => {
            const content = <HTMLElement>trigger.nextElementSibling;

            if (!content) {
                return;
            }

            const toggle = new Toggle(trigger, content);

            toggle.init();

            this.triggerInstances.push(toggle);

            // 他のメニューを閉じる
            trigger.addEventListener('click', () => {
                this.triggerInstances.forEach((otherToggle) => {
                    if (trigger !== otherToggle.trigger) {
                        otherToggle.close();
                    }
                });
            });

            // 閉じるボタン
            const targetInsert = content.querySelector('.js-localnav-dropdown-target-btn-insert');

            if (targetInsert) {
                this.insertCloseButton(targetInsert, toggle);
            }
        });
    }

    /**
     * 引数で指定した要素末尾に閉じるボタンを挿入します
     */
    insertCloseButton(targetElement: HTMLElement | Element, toggle: Toggle) {
        const btn = document.createElement('button');
        const scroll = new ScrollToTarget();

        btn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;

        btn.setAttribute('type', 'button');
        btn.setAttribute('class', this.btnClassName);
        btn.setAttribute('aria-controls', toggle.content.id);

        btn.addEventListener('click', () => {
            toggle.close();

            if (this.mql.matches) {
                // SP
                scroll.scrollToTarget(toggle.trigger);
            } else {
                // PC
                toggle.trigger.focus({
                    preventScroll: true,
                });
            }
        });

        targetElement.append(btn);
    }
}
