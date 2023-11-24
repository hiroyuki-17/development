/* eslint-disable */

/**
 * Easing - easeOutCubic
 *
 * @export
 * @param x 0から1の進捗率
 * @see {@link https://easings.net/ja#easeOutCubic}
 */
 export function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

/**
 * Easing - easeInOutQuint
 *
 * @export
 * @param x 0から1の進捗率
 * @see {@link https://easings.net/ja#easeInOutQuint}
 */
export function easeInOutQuint(x: number): number  {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;;
}

/* eslint-enable */
