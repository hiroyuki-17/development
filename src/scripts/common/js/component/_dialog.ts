import {
    disableBodyScroll,
    restrictFocus,
} from '../_utility/_utility.js';
import {langType} from '../header/_headerSetting.js';

/**
 * Dialog要素を活用したモーダルの制御を行います
 *
 * @export
 * @class Dialog
 */
export class Dialog {
    /** 展開対象となるDialog要素 */
    private targetDialog: HTMLDialogElement;
    private dialogInnerBody: HTMLElement | null;
    /** モーダル本体の展開元トリガーとなる要素 */
    private dialogTriggers: NodeListOf<HTMLAnchorElement>;
    private overflowStatusClass: string;
    /** アニメーション間隔[ms] */
    private animationDuration: number;

    /**
     * @param targetDialog モーダル本体となるDialog要素
     */
    constructor(targetDialog: HTMLDialogElement) {
        this.targetDialog = targetDialog;
        this.dialogInnerBody = this.targetDialog.querySelector<HTMLElement>('.js-dialog-body');
        this.dialogTriggers = document.querySelectorAll(`a[href="#${this.targetDialog.id}"]`);
        this.overflowStatusClass = 'is-overflow';
        this.animationDuration = 200;
    }

    init() {
        if (this.dialogTriggers.length === 0 || !this.dialogInnerBody) {
            return;
        }

        this.bindEvent();
        this.insertCloseBtn();
    }

    /**
     * 初回のイベント付与を行います
     */
    bindEvent() {
        this.dialogTriggers.forEach((trigger) => {
            trigger.classList.add('is-modal-trigger');
            trigger.setAttribute('role', 'button');
            trigger.setAttribute('aria-controls', this.targetDialog.id);

            trigger.addEventListener('click', this.open.bind(this));
            trigger.addEventListener('keydown', (e) => {
                const {key} = e;

                switch (key) {
                case ' ': // Space
                    this.open(e);
                    break;
                default:
                    break;
                }
            });
        });

        this.targetDialog.addEventListener('close', () => {
            this.close();
            disableBodyScroll(false);
            restrictFocus(this.targetDialog, false);
        });

        this.targetDialog.addEventListener('keydown', (e) => {
            const {key} = e;

            switch (key) {
            case 'Escape':
                e.preventDefault();

                this.close();
                break;
            default:
                break;
            }
        });

        let timer = 0;

        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = window.setTimeout(this.setOverflowStatus.bind(this), 20);
        });
    }

    /**
     * モーダル内に閉じるボタンを挿入します
     */
    insertCloseBtn() {
        // すでに挿入済みの場合は挿入しない
        if (this.targetDialog.querySelector('.m-dialog__close')) {
            return;
        }

        const btn = document.createElement('button');

        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'm-dialog__close');
        btn.setAttribute('aria-controls', this.targetDialog.id);
        btn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;

        btn.addEventListener('click', this.close.bind(this));
        this.targetDialog.append(btn);
    }


    /**
     * モーダルを展開します
     */
    open(event: Event) {
        event.preventDefault();

        const fadeIn = this.targetDialog.animate(
            [
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                },
            ],
            {
                duration: this.animationDuration,
                easing: 'ease',
                fill: 'forwards',
            },
        );

        this.targetDialog.showModal();
        disableBodyScroll(true);

        this.setOverflowStatus();

        fadeIn.play();
        restrictFocus(this.targetDialog, true);
    }

    /**
     * コンテンツ内がエリアをオーバーしているかをチェックしてオーバーしていれば特定のクラスを付与します
     */
    setOverflowStatus() {
        if (!this.dialogInnerBody) {
            return;
        }

        let modalHeight = this.targetDialog.clientHeight;
        const cssStyle = window.getComputedStyle(this.targetDialog);

        modalHeight -= parseFloat(cssStyle.paddingTop);
        modalHeight -= parseFloat(cssStyle.paddingBottom);

        const modalInnerheight = this.dialogInnerBody.scrollHeight;
        const isOverFlowContents = modalInnerheight > modalHeight;

        if (isOverFlowContents && !this.targetDialog.classList.contains(this.overflowStatusClass)) {
            this.targetDialog.classList.add(this.overflowStatusClass);
            this.dialogInnerBody.setAttribute('tabindex', '0');
        }
    }

    /**
     * モーダルを閉じます
     */
    close() {
        const fadeOut = this.targetDialog.animate(
            [
                {
                    opacity: 1,
                },
                {
                    opacity: 0,
                },
            ],
            {
                duration: this.animationDuration,
                easing: 'ease',
            },
        );

        fadeOut.play();
        fadeOut.finished.then(() => {
            this.targetDialog.close();

            if (this.targetDialog.classList.contains(this.overflowStatusClass)) {
                this.targetDialog.classList.remove(this.overflowStatusClass);
                this.dialogInnerBody?.removeAttribute('tabindex');
            }
        }).catch((e) => {
            throw new Error((e as Error).message);
        });
    }
}
