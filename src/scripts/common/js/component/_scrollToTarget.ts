import {
    MQL,
    SCROLL_ELEMENT,
    setFocusToTarget,
} from '../_utility/_utility.js';
import {easeInOutQuint} from '../_utility/_easing.js';

/**
 * 対象の要素に対してスクロールさせる制御クラス
 *
 * @export
 * @class ScrollToTarget
 */
export class ScrollToTarget {
    private scrollId: number;
    private fixedElement: HTMLElement | null;
    private durationScroll: number;
    /** windowオブジェクトに対してdispatchされるカスタムイベント : スムーススクロールが完了したことを通知する 'smoothscrollEnd' イベント */
    private scrollEndEvent: CustomEvent;

    constructor() {
        this.fixedElement = null;
        this.scrollId = 0;
        this.durationScroll = 800;
        this.scrollEndEvent = new CustomEvent('smoothScrollEnd');
    }

    /**
     * スクロール中に、故意のスクロール入力を検知した時スムーススクロール処理を中断する
     */
    cancelSmoothScroll(event: Event) {
        const {type} = event;
        const cancel = () => {
            window.removeEventListener('wheel', this.cancelSmoothScroll.bind(this));
            document.removeEventListener('touchstart', this.cancelSmoothScroll.bind(this));
            document.removeEventListener('keydown', this.cancelSmoothScroll.bind(this));
            window.cancelAnimationFrame(this.scrollId);
            this.scrollId = 0;
            document.documentElement.style.scrollBehavior = '';
        };

        if (type === 'wheel' || type === 'touchstart') {
            cancel();

            return;
        } else if (type !== 'keydown') {
            return;
        }

        const {key} = <KeyboardEvent>event;

        // スクロールするようなキー入力の場合
        switch (key) {
        case ' ':
        case 'Tab':
        case 'Home':
        case 'End':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'PageUp':
        case 'PageDown':
            cancel();
            break;
        default:
            break;
        }
    }

    /**
     * 固定要素の高さを返す
     *
     * @returns {Number} 高さの数値
     */
    getFixedElementHeight() {
        const isSpView = MQL.matches;

        if (!this.fixedElement || isSpView) {
            return 0;
        }

        return this.fixedElement.offsetHeight;
    }

    /**
     * 引数で指定した要素の垂直方向に対する絶対位置の値を返す
     */
    getTargetPosition(targetElement: HTMLElement): number {
        return window.pageYOffset + targetElement.getBoundingClientRect().top - this.getFixedElementHeight();
    }

    /**
     * 引数で渡された、アンカー先の対象要素までスクロール処理を行う
     */
    scrollToTarget(targetToScrollElement: HTMLElement) {
        const startStamp = performance.now();
        // window.pageYOffset + element.getBoundingClientRect().top → 対象要素までの絶対位置
        const targetPosition = this.getTargetPosition(targetToScrollElement);
        const currentScrollAmount = SCROLL_ELEMENT.scrollTop;
        const scrollDistance = (targetPosition - currentScrollAmount);

        // スムーススクロール制御中にスクロール関連のイベントを無効にする
        window.addEventListener('wheel', this.cancelSmoothScroll.bind(this));
        document.addEventListener('touchstart', this.cancelSmoothScroll.bind(this));
        document.addEventListener('keydown', this.cancelSmoothScroll.bind(this));

        document.documentElement.style.scrollBehavior = 'auto';

        // 現在のスクロール位置を基準として、指定時間までスクロールを実行
        const scrollControl = (timestamp: DOMHighResTimeStamp) => {
            const progress = Math.min((timestamp - startStamp) / this.durationScroll, 1);

            if (progress < 1) {
                window.scrollTo(0, currentScrollAmount + (scrollDistance * easeInOutQuint(progress)));
                this.scrollId = window.requestAnimationFrame(scrollControl);

                return;
            }

            // スクロール完了後
            window.scrollTo(0, targetPosition);
            document.documentElement.style.scrollBehavior = '';

            // スクロール中断制御を解除
            window.removeEventListener('wheel', this.cancelSmoothScroll.bind(this));
            document.removeEventListener('touchstart', this.cancelSmoothScroll.bind(this));
            document.removeEventListener('keydown', this.cancelSmoothScroll.bind(this));

            // フォーカス制御
            setFocusToTarget(targetToScrollElement);

            window.dispatchEvent(this.scrollEndEvent);
        };

        this.scrollId = window.requestAnimationFrame(scrollControl);
    }
}
