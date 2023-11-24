import {restrictFocus} from '/common/js/_utility/_utility.js';

/**
 * ヘッダー検索・検索エリアの制御を行う
 *
 * @export
 * @class HeaderSearch
 */
export class HeaderSearch {
    /** サイト内検索エリア展開のきっかけとなるトリガー要素 */
    private trigger: HTMLAnchorElement;
    /** 展開対象のサイト内検索エリア要素 */
    private targetArea: HTMLElement;
    /** 検索input要素 */
    private inputArea: HTMLInputElement;
    /** 検索エリアを閉じるボタン要素 */
    private closeBtn: HTMLButtonElement | null;
    /** エリアが展開中かどうか */
    private isOpen: boolean;
    /** エリアが展開中にエリアに付与されるステータスクラス名 */
    private isOpenClass: string;

    constructor(trigger: HTMLAnchorElement, targetArea: HTMLElement, inputArea: HTMLInputElement) {
        this.trigger = trigger;
        this.targetArea = targetArea;
        this.inputArea = inputArea;
        this.isOpen = false;
        this.closeBtn = null;
        this.isOpenClass = 'is-visible';
    }

    /**
     * 初回の制御用
     */
    init() {
        if (!this.trigger || !this.targetArea || !this.inputArea) {
            return;
        }

        this.trigger.setAttribute('role', 'button');
        this.closeBtn = document.querySelector('.js-header-search-close');

        this.bindEvent();
    }

    /**
     * 要素に対してイベントを付与します
     */
    bindEvent() {
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();

            if (this.isOpen) {
                this.close();

                return;
            }

            e.stopPropagation();
            this.open();
        });

        this.trigger.addEventListener('keydown', (e) => {
            const {key} = e;

            if (key !== 'Enter') {
                return;
            }

            e.preventDefault();

            if (this.isOpen) {
                this.close();

                return;
            }

            this.open();
        });

        this.targetArea.addEventListener('click', (e) => e.stopPropagation());

        window.addEventListener('headerReset', this.close.bind(this));

        // Escapeキーによるエリアの閉じる制御
        document.addEventListener('keydown', (e) => {
            const {key} = e;

            if (key !== 'Escape' || !this.isOpen) {
                return;
            }

            this.close();
            this.trigger.focus({
                preventScroll: true,
            });
        });

        document.addEventListener('click', () => {
            if (this.isOpen) {
                this.close();
            }
        });

        if (this.closeBtn) {
            this.closeBtn.setAttribute('aria-controls', this.targetArea.id);
            this.closeBtn.addEventListener('click', () => {
                this.close();
                this.trigger.focus();
            });
        }
    }

    /**
     * ヘッダー検索エリアを開きます
     */
    open() {
        this.isOpen = true;
        this.trigger.ariaExpanded = 'true';
        this.targetArea.classList.add(this.isOpenClass);

        this.targetArea.addEventListener('transitionend', () => {
            this.inputArea.focus({
                preventScroll: true,
            });

            restrictFocus(this.targetArea, true);
        }, {
            once: true,
        });
    }

    /**
     * ヘッダー検索エリアを開きます
     */
    close() {
        this.isOpen = false;
        this.trigger.ariaExpanded = 'false';
        this.targetArea.classList.remove(this.isOpenClass);
        restrictFocus(this.targetArea, false);
    }
}
