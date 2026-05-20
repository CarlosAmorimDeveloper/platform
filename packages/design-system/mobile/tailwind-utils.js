/**
 * Converts a unitless pixel number to a CSS px string.
 * @param {number} val
 * @returns {string}
 */
function toPx(val) {
  return `${val}px`;
}

/**
 * Maps every value in an object from a unitless px number to a CSS px string.
 * @param {Record<string | number, number>} obj
 * @returns {Record<string, string>}
 */
function mapToPx(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toPx(v)]));
}

module.exports = { toPx, mapToPx };
