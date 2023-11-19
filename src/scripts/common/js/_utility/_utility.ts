/**
 * ブレイクポイント (MediaQueryListで参照されるメジャーブレイクポイント)
 */
export const BREAK_POINT = 767;

/**
 * スクロール対象要素
 */
export const SCROLL_ELEMENT = <HTMLElement>document.scrollingElement;

/**
 * フォーカス可能要素のセレクタ
 */
export const FOCUS_SELECTOR = 'a[href], area[href], [tabindex]:not([tabindex="-1"]), button, input:not([type="hidden"]), select, textarea, iframe, object, audio, video, embed, summary';

/**
 * matchMediaオブジェクト
 */
export const MQL = window.matchMedia(`(max-width:${BREAK_POINT}px)`);

/**
 * 引数で指定した要素が、フォーカス可能な要素かどうかのBoolean値を返します
 */
export const isFocusableElement = (element: HTMLElement) : boolean => element.matches(FOCUS_SELECTOR);

/**
 * 引数で指定した要素に対してfocusメソッドを実行します
 *
 * @param targetFocusElement フォーカスを移動させたい対象の要素
 */
export const setFocusToTarget = (targetFocusElement: HTMLElement) => {
    if (isFocusableElement(targetFocusElement)) {
        targetFocusElement.focus({
            preventScroll: true,
        });

        return;
    }
    targetFocusElement.setAttribute('tabindex', '-1');
    targetFocusElement.focus({
        preventScroll: true,
    });
    targetFocusElement.removeAttribute('tabindex');
};

/**
 * 第2引数で指定した時間経過後、第1引数で渡したコールバックを実行します
 *
 * @param callBack 実行するコールバック
 * @param delayTime 何ミリ秒後に実行するか[ms]
 * @return window.requestAnimationFrameの戻り値[requestID]
 */
export const setTimeoutAnimationFrame = (callBack : () => void, delayTime : number) : number => {
    if (typeof callBack !== 'function' || !callBack) {
        throw new Error('Arguments 1 Error : This function required Callback.');
    }

    if (typeof delayTime !== 'number') {
        throw new Error('Arguments 2 Error : delayTime must be a "number".');
    }

    let requestId = 0;
    const startStamp = performance.now();
    const handler = (nowStamp : DOMHighResTimeStamp) => {
        const progress = Math.min((nowStamp - startStamp) / delayTime, 1);

        if (progress === 1) {
            // delayTime時間経過後にコールバックを実行
            callBack();

            return;
        }

        requestId = window.requestAnimationFrame(handler);
    };

    requestId = window.requestAnimationFrame(handler);

    return requestId;
};

export interface focusControlCallBack {
    [key: string]: (e: KeyboardEvent) => void;
}

/**
 * メニュー展開時のフォーカス制御（ダイアログなどを展開している際に使用）
 * 第1引数で指定された要素内だけでフォーカスを巡回させるように制御し、背景エリア等にはフォーカスが移動しないようにする。
 * @param argElement: フォーカスを巡回させる対象の要素
 * @param isRestricted: true / 対象エリア内だけでフォーカスを巡回させる, false / フォーカス制御を解除
 * @param nameUniqueKey: 登録する際に固有の識別子文字列を指定。イベントを解除するために必要。
 */
export const restrictFocus = (argElement : HTMLElement, isRestricted : boolean, nameUniqueKey: string) => {
    if (!nameUniqueKey) {
        throw new Error('任意の識別子文字列を指定してください。登録・削除時に参照します');
    }

    const elemFocusAble = argElement.querySelectorAll<HTMLElement>(FOCUS_SELECTOR);
    const [elemFocusAbleFirst] = elemFocusAble;
    const elemFocusAbleLast = elemFocusAble[elemFocusAble.length - 1];

    const controlFocus = (event: KeyboardEvent) => {
        const {key} = event;
        const active = document.activeElement;

        if (key === 'Tab') {
            if (event.shiftKey) {
                // shift + tab
                if (active === elemFocusAbleFirst) {
                    // エリア内最後のフォーカス要素へフォーカスを移動
                    event.preventDefault();
                    elemFocusAbleLast.focus({
                        preventScroll: true,
                    });
                }
            } else {
                // tab
                if (active === elemFocusAbleLast) {
                    // エリア内最初のフォーカス要素へフォーカスを移動
                    event.preventDefault();
                    elemFocusAbleFirst.focus({
                        preventScroll: true,
                    });
                }
            }
        }
    };

    // 制御の有無
    if (isRestricted) {
        // 対象エリア内だけでフォーカスを巡回させる
        elemFocusAbleFirst.addEventListener('keydown', controlFocus);
        elemFocusAbleLast.addEventListener('keydown', controlFocus);

        if (!window.focusControlCallBackList) {
            window.focusControlCallBackList = {};
        }

        window.focusControlCallBackList[nameUniqueKey] = controlFocus;

        return;
    }

    // フォーカス制御を解除
    if (window.focusControlCallBackList && window.focusControlCallBackList[nameUniqueKey]) {
        elemFocusAbleFirst.removeEventListener('keydown', window.focusControlCallBackList[nameUniqueKey]);
        elemFocusAbleLast.removeEventListener('keydown', window.focusControlCallBackList[nameUniqueKey]);
    }
};

/**
 * スクロールを無効化する（ダイアログなどを展開している際に使用）
 * @param isDisabled: true / 無効化を有効にする, false / 無効化を解除する
 */
export const disableBodyScroll = (isDisabled: boolean) => {
    const {body} = document;
    const adjustFixedPosition = window.scrollY;

    if (isDisabled) {
        body.style.position = 'fixed';
        body.style.width = '100%';
        body.style.overflow = 'hidden';
        body.style.top = `${adjustFixedPosition * -1}px`;
        body.dataset.scrollTop = `${adjustFixedPosition}`;

        return;
    }

    body.style.position = '';
    body.style.width = '';
    body.style.overflow = '';
    body.style.top = '';

    if (!body.dataset.scrollTop) {
        return;
    }

    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, parseInt(body.dataset.scrollTop, 10));
    document.documentElement.style.scrollBehavior = '';
    body.dataset.scrollTop = '';
};

/**
 * ランダムなID数値を返します
 *
 * @returns {number}
 */
export const getRandomId = () => {
    let randomId = Date.now();
    let isSameIdExists = false;

    // ページ上に取得したIDを含む要素がいないか探索
    do {
        if (document.querySelector(`[id*="${randomId}"]`)) {
            isSameIdExists = true;
            randomId = Date.now();
        } else {
            isSameIdExists = false;
        }
    } while (isSameIdExists);

    return randomId;
};
