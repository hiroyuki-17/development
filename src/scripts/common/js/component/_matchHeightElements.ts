interface matchHeightElementsOption {
    /** リサイズ時の高さ揃え実行遅延タイミング[ms] */
    debounce?: number,
    /** 高さ揃えの対象に入れる要素class属性値 ※ document.getElementsByClassNameで参照します */
    targetClassName?: string,
}

const defaultOption: matchHeightElementsOption = {
    debounce: 100,
    targetClassName: 'js-mh-target',
};

/**
 * 高さ揃えを行う処理用クラス
 *
 * @export
 * @class MatchHeightElements
 * ```
 * // 高さを揃えたい要素に対して以下のクラスを付与する(グループによる高さ揃えではなく一律の高さ揃えになります)
 * <element class="js-mh-target">hogehoge</element>
 *
 * // 高さを揃えたい要素をグループで分けたい場合は、data-mh-groupを指定し「任意のグループ名」を指定します。
 * // この時、行ごとに高さ揃えを実行します。
 * <element class="js-mh-target" data-mh-group="group1">hogehoge</element>
 * <element class="js-mh-target" data-mh-group="group2">piyopiyopiyopiyo</element>
 * <element class="js-mh-target" data-mh-group="group3">fugafugafugafugafugafugafugafuga</element>
 *
 * <element class="js-mh-target" data-mh-group="group1">hogehoge</element>
 * <element class="js-mh-target" data-mh-group="group2">piyopiyopiyopiyo</element>
 * <element class="js-mh-target" data-mh-group="group3">fugafugafugafugafugafugafugafuga</element>
 * ```
 */
export class MatchHeightElements {
    private option: matchHeightElementsOption;
    private targetClassSelector: string;
    private targetsAll: HTMLCollectionOf<HTMLElement> | null;
    private timerId: number;
    private flgGroupBy: boolean;
    private groupDataName: string;
    private groupDataNameValueDefault: string;

    /**
     * MatchHeightElements クラスコンストラクタ
     * @memberof MatchHeightElements
     */
    constructor(settings: matchHeightElementsOption) {
        this.option = {
            ...defaultOption,
            ...settings,
        };

        this.targetClassSelector = this.option.targetClassName ? this.option.targetClassName : 'js-mh-target';
        this.targetsAll = null;

        this.timerId = 0;
        this.flgGroupBy = false;

        this.groupDataName = 'data-mh-group';
        this.groupDataNameValueDefault = 'default';
    }

    init() {
        this.targetsAll = document.getElementsByClassName(this.targetClassSelector) as HTMLCollectionOf<HTMLElement>;

        if (!this.targetsAll) {
            return;
        }

        document.addEventListener('DOMContentLoaded', this.setHeight.bind(this));
        window.addEventListener('load', this.setHeight.bind(this));
        window.addEventListener('resize', this.handlerResize.bind(this));
    }

    /**
     * リサイズ時の処理
     */
    handlerResize() {
        clearTimeout(this.timerId);
        this.timerId = window.setTimeout(() => {
            this.setHeight();
        }, this.option.debounce);
    }

    /**
     * 高さ揃え処理を行うメインメソッド
     */
    setHeight() {
        if (!this.targetsAll || this.targetsAll.length === 0) {
            return;
        }

        const groupElement = [...this.targetsAll].filter((item) => item.hasAttribute(this.groupDataName));

        if (groupElement.length) {
            this.flgGroupBy = true;
        }

        if (this.flgGroupBy) {
            // グループごとに高さ揃え
            this.setHeightByGroup();

            return;
        }

        // 通常の高さ揃え(一律)
        this.setHeighToElements(this.targetsAll);
    }

    /**
     * グループによる高さ揃えがある場合の処理
     */
    setHeightByGroup() {
        if (!this.targetsAll || this.targetsAll.length === 0) {
            return;
        }

        /** グループ名 */
        const groupName: string[] = [];

        for (let i = 0, max = this.targetsAll.length; i < max; i++) {
            const elem = this.targetsAll[i];

            if (elem.hasAttribute(this.groupDataName)) {
                const name = elem.getAttribute(this.groupDataName);

                if (!name) {
                    continue;
                }

                if (groupName.indexOf(name) < 0) {
                    groupName.push(name);
                }

                continue;
            }

            // グループ名の指定がない通常の高さ揃え要素判別用に属性をセットしておく
            elem.setAttribute(this.groupDataName, this.groupDataNameValueDefault);

            if (groupName.indexOf(this.groupDataNameValueDefault) < 0) {
                groupName.push(this.groupDataNameValueDefault);
            }
        }

        // data属性グループごとに要素をキャッシュ
        const groupElement: Array<Array<HTMLElement>> = [];

        for (let i = 0, maxI = groupName.length; i < maxI; i++) {
            groupElement[i] = [...this.targetsAll].filter((item) => item.getAttribute(this.groupDataName) === groupName[i]);

            if (!groupElement[i]) {
                continue;
            }

            if (groupElement[i][0].getAttribute(this.groupDataName) === this.groupDataNameValueDefault) {
                // グループ名の指定がない通常の高さ揃え対象要素の場合は行ごとの高さ揃えを行わない
                this.setHeighToElements(groupElement[i]);

                continue;
            }

            // 行ごとに高さ揃えを実行
            const rowGroup = this.getElementsGroupByRow(groupElement[i]);

            if (!rowGroup) {
                continue;
            }

            for (let j = 0, maxJ = rowGroup.length; j < maxJ; j++) {
                const row = rowGroup[j];

                this.setHeighToElements(row);
            }
        }
    }

    /**
     * 引数で渡された要素に対して処理を行い、高さ揃えを実行する
     */
    // eslint-disable-next-line class-methods-use-this
    setHeighToElements(elements: HTMLCollectionOf<HTMLElement> | HTMLElement[]) {
        /** 高さリスト */
        const heightData: number[] = [];
        let heightMax = 0;

        for (let i = 0, max = elements.length; i < max; i++) {
            elements[i].style.height = '';
            heightData.push(elements[i].clientHeight);
        }

        heightMax = Math.max.apply(null, heightData);

        if (!heightMax) {
            return;
        }

        for (let i = 0, max = elements.length; i < max; i++) {
            elements[i].style.height = `${heightMax}px`;
        }
    }

    /**
     * 引数で渡された要素から、行ごとの要素リストを返します
     * [data-mh-group]属性値を指定する必要があります
     */
    // eslint-disable-next-line class-methods-use-this
    getElementsGroupByRow(elements: HTMLCollectionOf<HTMLElement> | HTMLElement[]) {
        /** 行ごとの要素に分かれた配列作成用 */
        const rowGroup: Array<Array<HTMLElement>> = [];
        /** 同じ行の要素を格納するための配列 */
        let rowData: HTMLElement[] = [];
        let comparePositionTop = 0;

        for (let i = 0, max = elements.length; i < max; i++) {
            const elem = elements[i];
            const positionTop = window.pageYOffset + elem.getBoundingClientRect().top;

            if (i === 0) {
                // 初期基準値をセット
                comparePositionTop = positionTop;

                if (comparePositionTop === positionTop) {
                    rowData.push(elem);
                    rowGroup[0] = rowData;
                } else {
                    rowData.push(elem);
                    rowGroup.push(rowGroup[0]);
                }

                continue;
            }

            if (comparePositionTop === positionTop) {
                // 比較要素の絶対位置上の基準値が同じの場合はその要素が同じ行にあると判定する
                rowData.push(elem);
                rowGroup[rowGroup.length - 1] = rowData;
            } else {
                // 別の行の場合
                rowData = [];
                rowData.push(elem);
                rowGroup.push(rowData);
            }

            // 基準値を入れ替える
            comparePositionTop = positionTop;
        }

        return rowGroup;
    }

    /**
     * 高さ揃えの再実行
     */
    public update() {
        if (!this.targetsAll) {
            return;
        }

        this.setHeight();
    }

    /**
     * 高さ揃え状態を解除する
     *
     * @memberof MatchHeightElements
     */
    public destroy() {
        if (!this.targetsAll) {
            return;
        }

        for (let i = 0, max = this.targetsAll.length; i < max; i++) {
            this.targetsAll[i].style.height = '';
        }
        window.removeEventListener('resize', this.handlerResize.bind(this));
    }
}
