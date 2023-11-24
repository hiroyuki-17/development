type showMoreContentsOption = {
    /**
     * もっと見る機能で対象にする表示切替対象の任意の要素クラス名
     * @default "js-show-more-target"
     */
    targetsClassName: string,
}

const defaultOption: showMoreContentsOption = {
    targetsClassName: 'js-show-more-target',
};

/**
 * もっと見る機能を制御する
 *
 * 第1引数で指定したルート要素にdata属性値を付与することで、指定個数づつ表示に切り替える
 * 指定がない場合は、一度にすべて表示する
 *
 * ```html
 * <!-- 2つ毎に表示したい場合 -->
 * <element data-show-more-num="2">
 * </element>
 * ```
 *
 * @export
 * @class ShowMoreContents
 */
export class ShowMoreContents {
    /** 都度表示する要素群の親要素 */
    private root: HTMLElement;
    /** 展開トリガーとなるボタン要素 */
    private btnMore: HTMLButtonElement;
    /** 表示制御対象の要素群 */
    private targets: NodeListOf<HTMLElement>;
    /** 何個ごとに表示するかの指定 (0の場合一度に隠しているものをすべて表示) */
    private eachNum: number;
    /** オプション */
    private option: showMoreContentsOption;

    constructor(root: HTMLElement, btnMore: HTMLButtonElement, option?: showMoreContentsOption) {
        this.option = {
            ...defaultOption,
            ...option,
        };
        this.root = root;
        this.btnMore = btnMore;
        this.targets = this.root.querySelectorAll(`.${this.option.targetsClassName}`);
        this.eachNum = 0;
    }

    init() {
        if (this.targets.length === 0) {
            this.btnMore.remove();

            return;
        }

        this.setMode();

        const ID = `target-more-root-${Date.now()}`;

        this.root.setAttribute('id', ID);
        this.btnMore.setAttribute('aria-controls', ID);
        this.bindEvent();
    }

    /**
     * 表示制御の設定をセットします
     */
    setMode() {
        const showNumValue = this.root.dataset.showMoreNum;

        if (!showNumValue) {
            return;
        } else if (!/[1-9]+/u.test(showNumValue)) {
            throw new Error(`何個ごとに表示するかの指定に誤りがあります : \n${this.root.outerHTML}`);
        }

        this.eachNum = Number(showNumValue);
    }

    /**
     * 初回のイベント定義を制御します
     */
    bindEvent() {
        this.btnMore.addEventListener('click', this.handlerShowMore.bind(this));
    }

    /**
     * ボタンクリック時のコールバック
     */
    handlerShowMore() {
        if (this.eachNum === 0) {
            // 一度にすべて表示
            this.targets.forEach((target) => this.showContent(target));
            this.btnMore.remove();

            return;
        }

        // 件数指定毎に表示
        let endFlg = false;
        const eachShowCount = this.eachNum === 0 ? this.targets.length : this.eachNum;

        this.targets = this.root.querySelectorAll(`.${this.option.targetsClassName}`);

        for (let i = 0; i < eachShowCount; i++) {
            if (this.targets[i]) {
                this.showContent(this.targets[i]);

                continue;
            }

            endFlg = true;
        }

        if (endFlg) {
            this.btnMore.remove();
        }
    }

    /**
     * 対象要素を表示状態に切り替える
     */
    showContent(target: HTMLElement) {
        target.classList.remove(this.option.targetsClassName);
    }
}
