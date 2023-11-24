/**
 * 日付フィールドのモジュールで使用する非表示チェックボックスによるdisabled属性の制御を行います
 *
 * @export
 * @class checkDisabled
 */
export class CheckDisabled {
    /** 非表示チェックボックスを含んだ親要素 */
    private disabledRoot: HTMLElement;
    /** 非表示チェックボックスのトリガー要素 */
    private disabledTrigger: null | HTMLInputElement;
    /** 非表示チェックボックスの対象となる要素 */
    private disabledTargets: NodeListOf<HTMLInputElement>;

    /**
     * @param checkDisabledRoot 非表示チェックボックスを含んだ親要素
     */
    constructor(checkDisabledRoot: HTMLElement) {
        this.disabledRoot = checkDisabledRoot;
        this.disabledTrigger = null;
        this.disabledTargets = this.disabledRoot.querySelectorAll('input[type="date"]');
    }

    init() {
        if (!this.disabledRoot) {
            return;
        }

        this.disabledTrigger = this.disabledRoot.querySelector('.js-check-disabled-trigger');

        if (!this.disabledTrigger) {
            return;
        }

        this.setDisabledAttribute();
        this.disabledTrigger.addEventListener('click', this.changeDisabled.bind(this));
    }

    setDisabledAttribute() {
        if (!this.disabledTrigger) {
            return;
        }

        const rootId = `disabled-${Date.now()}`;
        const idList: string[] = [];

        this.disabledTargets.forEach((target, index) => {
            const ID = `${rootId}-${index + 1}`;
            target.setAttribute('id', ID);

            idList.push(ID);
        });

        // 配列に格納された値を半角スペース刻みで`aria-controls`の属性値としてセット
        this.disabledTrigger.setAttribute('aria-controls', idList.join(' '));
    }

    changeDisabled() {
        if (!this.disabledTrigger) {
            return;
        }

        this.disabledTargets.forEach((target) => {
            if (this.disabledTrigger?.checked) {
                target.disabled = true;

                return;
            }

            target.disabled = false;
        });
    }
}
