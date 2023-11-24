import {mqlHeader} from '/common/js/header/_headerSetting.js';

/**
 * 文字サイズ変更の制御を行います
 *
 * @export
 * @class HeaderFontsizeChange
 */
export class HeaderFontsizeChange {
    /** トリガーとなる要素 */
    public triggers: NodeListOf<HTMLButtonElement>;
    /** HTML要素 */
    public html: HTMLElement;
    /** HTML要素 */
    public mql: MediaQueryList;

    /**
     * @param triggers トリガーとなる要素
     */
    constructor(triggers: NodeListOf<HTMLButtonElement>) {
        this.triggers = triggers;
        this.html = document.documentElement;
        this.mql = mqlHeader;
    }

    /**
     * 初回の制御用
     */
    init() {
        if (this.mql.matches) {
            this.html.classList.remove('font-large');

            return;
        }

        this.bindEvent();
    }

    bindEvent() {
        this.triggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                this.resetStatus();
                trigger.classList.add('is-selected');

                const dataStyle = trigger.getAttribute('data-style');

                switch (dataStyle) {
                case 'large':
                    this.html.classList.add('font-large');
                    break;
                case 'medium':
                default:
                    this.html.classList.remove('font-large');
                    break;
                }
            });
        });
    }

    /**
     * ボタンの活性をリセット
     */
    resetStatus() {
        this.triggers.forEach((elem) => {
            elem.classList.remove('is-selected');
        });
    }
}
