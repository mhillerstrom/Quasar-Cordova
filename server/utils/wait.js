/**
 * Waits (minimum) ms milliseconds before returning.
 *
 * Example:
 * ```JavaScript
 *   await wait(2000); // waits (at least) 2 seconds before resuming execution
 * ```
 *
 * @param {Integer} ms  Number of milliseconds to wait
 */

function wait (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};

module.exports = wait
