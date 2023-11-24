import {
    setTimeoutAnimationFrame,
    getRandomId,
} from '../_utility/_utility.js';

type ToggleOption = {
    /** トグル要素の制御中に付与されるクラス名 */
    className: {
        /**
         * トグルが展開中にトリガーとコンテンツに付与するステータスクラス名
         * @default 'is-open';
         */
        isOpen: string,
    },
    /**
     * トグルとコンテンツペアとなるその親要素（指定は任意で指定されていなくとも良い）
     * ※ この要素にも開閉中のステータスクラスが付与される
     * ※ トグルの開閉ステータスに応じてここで指定された要素でもCSSスタイリングを制御しなければならない場合に使用する
     */
    wrapperElement: HTMLElement | null,
}

const defaultOption: ToggleOption = {
    className: {
        isOpen: 'is-open',
    },
    wrapperElement: null,
};

/**
 * トグルの基本的な開閉制御を行います
 *
 * ```html
 * <!-- 最低限必要なマークアップ例 -->
 * <button type="button">任意のトリガー要素</button>
 * <element> <!-- トグルコンテンツ本体を内包するラッパー要素を必ず用意する -->
 *     <element>トグルコンテンツ本体</element>
 * </element>
 * ```
 *
 * @export
 * @class Toggle
 */
export class Toggle {
    /** トグルの展開トリガー要素 */
    public trigger: HTMLElement;
    /** トグルの展開対象コンテンツ要素 */
    public content: HTMLElement;
    /** トグルのオプション指定 */
    public option: ToggleOption;

    constructor(triggerElement: HTMLElement, contentElement: HTMLElement, settings?: ToggleOption) {
        this.trigger = triggerElement;
        this.content = contentElement;
        this.option = {
            ...defaultOption,
            ...settings,
        };
    }

    init() {
        this.setAttributes();
        this.bindEvent();
    }


    /**
     * 要素に対して初回の属性付与を行います
     */
    setAttributes() {
        const ID = `toggle-${getRandomId()}`;

        this.trigger.setAttribute('aria-controls', ID);
        this.trigger.setAttribute('aria-expanded', 'false');
        this.content.setAttribute('id', ID);
    }

    /**
     * 要素に対して初回イベント付与を行います
     */
    bindEvent() {
        this.trigger.addEventListener('click', () => {
            if (this.isOpen()) {
                this.close();

                return;
            }

            this.open();
        });

        this.content.addEventListener('transitionend', () => {
            this.content.style.height = '';

            if (!this.isOpen()) {
                this.trigger.classList.remove(this.option.className.isOpen);
                this.content.classList.remove(this.option.className.isOpen);
            }
        });
    }

    /**
     * 開閉中かどうかを返す
     */
    isOpen(): boolean {
        const ariaExpanded = this.trigger.getAttribute('aria-expanded');

        return ariaExpanded === 'true';
    }

    /**
     * トグルコンテンツを開きます
     */
    open() {
        this.trigger.setAttribute('aria-expanded', 'true');
        this.trigger.classList.add(this.option.className.isOpen);
        this.content.classList.add(this.option.className.isOpen);

        if (this.option.wrapperElement) {
            this.option.wrapperElement.classList.add(this.option.className.isOpen);
        }

        const height = this.content.scrollHeight;

        this.content.style.height = '0';

        setTimeoutAnimationFrame(() => {
            this.content.style.height = `${height}px`;
        }, 10);
    }

    /**
     * トグルコンテンツを閉じます
     */
    close() {
        this.trigger.setAttribute('aria-expanded', 'false');

        if (this.option.wrapperElement) {
            this.option.wrapperElement.classList.remove(this.option.className.isOpen);
        }

        const height = this.content.scrollHeight;

        this.content.style.height = `${height}px`;

        setTimeoutAnimationFrame(() => {
            this.content.style.height = '0';
        }, 10);
    }
}
