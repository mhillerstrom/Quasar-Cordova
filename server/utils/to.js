/**
  *
  * Transforms a promise for "await" to return both error and result so you don't have to wrap promises in try catch
  * @example ```
  *
  * var [ error, result ] = await to(promise)
  *
  * ```
  */

const to = function (promise) {
  return promise.then(result => [null, result]).catch(err => [err, null])
}

module.exports = to
