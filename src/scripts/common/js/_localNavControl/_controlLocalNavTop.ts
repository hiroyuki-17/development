import {
    MQL,
} from '/common/js/_utility/_utility.js';
import {Toggle} from '/common/js/component/_toggle.js';
import {CurrentPathControl} from '/common/js/component/_currentPathControl.js';
import {ScrollToTarget} from '/common/js/component/_scrollToTarget.js';
import {langType} from '/common/js/header/_headerSetting.js';

export class ControlLocalNavTop {
    private navRoot: HTMLElement;
    private navToggleTrigger: HTMLElement | null;
    private currentPath: string;
    private spToggle: Toggle | null;
    private mql: MediaQueryList;
    private btnClassName: string;
    private clonedListWrapperClass: string;

    constructor(navRoot: HTMLElement) {
        this.navRoot = navRoot;
        this.navToggleTrigger = navRoot.querySelector('.js-localnav-top-trigger');
        this.currentPath = window.location.pathname;
        this.spToggle = null;
        this.mql = MQL;
        this.btnClassName = 'str-nav-local__close';
        this.clonedListWrapperClass = 'str-nav-local__inner';
    }

    init() {
        if (this.navToggleTrigger) {
            const content = this.navToggleTrigger.nextElementSibling;

            this.spToggle = new Toggle(this.navToggleTrigger, <HTMLElement>content);
            this.spToggle.init();
        }

        this.insertCloseBtn();
        this.bindEvent();

        const linkCurrentTargets = this.navRoot.querySelectorAll<HTMLAnchorElement>('.js-localnav-link-target');
        const linkCurrentSubTargets = document.querySelectorAll<HTMLAnchorElement>('.js-localnav-link-target-sub');

        // 第5階層回遊ナビに対するカレント制御
        if (linkCurrentSubTargets.length !== 0) {
            const currentPathControlSub = new CurrentPathControl(linkCurrentSubTargets, {
                className: {
                    isCurrent: 'is-current',
                },
                matchRuleType: 'directory',
            });

            currentPathControlSub.init();
        }

        // 第4階層回遊ナビに対するカレント制御
        if (linkCurrentTargets.length !== 0) {
            const currentPathControl = new CurrentPathControl(linkCurrentTargets, {
                className: {
                    isCurrent: 'is-current',
                },
                matchRuleType: 'directory',
            });

            currentPathControl.init();
            this.insertCloneListForSp(currentPathControl);
        }
    }

    /**
     * 第5階層回遊ナビゲーションのリンクリストを第4階層ナビ現在地の末尾に複製して挿入する
     */
    insertCloneListForSp(pathControl: CurrentPathControl) {
        const {matchedElements} = pathControl;
        const insertListTarget = document.querySelector('.js-localnav-insert-list');

        if (!insertListTarget || matchedElements.length === 0) {
            return;
        }

        const wrapperElement = document.createElement('div');
        const cloneList = insertListTarget.cloneNode(true);

        wrapperElement.classList.add(this.clonedListWrapperClass);
        wrapperElement.append(cloneList);

        // ヒットした現在地の要素の後ろに追加
        const [currentPathElement] = matchedElements;

        currentPathElement.after(wrapperElement);
    }

    /**
     * ブレイクポイントの切り替わりで行う処理
     */
    handlerBreakPoint() {
        const isMobile = this.mql.matches;

        if (isMobile) {
            return;
        }

        if (this.navToggleTrigger && this.navToggleTrigger.ariaExpanded === 'true') {
            this.navToggleTrigger.ariaExpanded = 'false';
        }

        if (this.spToggle) {
            this.spToggle.content.classList.remove(this.spToggle.option.className.isOpen);
        }
    }

    /**
     * 初回のイベント制御を行います
     */
    bindEvent() {
        this.mql.addEventListener('change', this.handlerBreakPoint.bind(this));

        if (this.navToggleTrigger) {
            this.navToggleTrigger.addEventListener('click', () => {
                this.navRoot.classList.toggle('is-visible');
            });
        }
    }

    /**
     * 閉じるボタンを挿入します
     */
    insertCloseBtn() {
        const insertArea = this.navRoot.querySelector('.js-localnav-top-btn-insert');
        const scroll = new ScrollToTarget();

        if (!insertArea || !this.spToggle) {
            return;
        }

        const btn = document.createElement('button');

        btn.innerHTML = `<span>${langType === 'ja' ? '閉じる' : 'Close'}</span>`;
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', this.btnClassName);
        btn.setAttribute('aria-controls', this.spToggle.content.id);
        btn.addEventListener('click', () => {
            if (this.spToggle) {
                this.spToggle.close();

                scroll.scrollToTarget(this.spToggle.trigger);
            }
        });

        insertArea.appendChild(btn);
    }
}
