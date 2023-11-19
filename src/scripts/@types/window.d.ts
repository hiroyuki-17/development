import type {focusControlCallBack} from '/common/js/_utility/_utility';

declare global {
    interface Window {
        /** フォーカスコントロールの際に参照する情報（restrictFocus関数で使用される） */
        focusControlCallBackList: focusControlCallBack | undefined;
    }
}
