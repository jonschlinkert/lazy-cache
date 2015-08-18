'use strict';
var colors = lazyCache(require);
colors('ansi-yellow');

/**
 * Cache results of the first function call to ensure only calling once.
 *
 * ```js
 * // cache the call to `require('ansi-yellow')`
 * var lazy = lazyCache(require);
 * lazy('ansi-yellow');
 * // use `ansi-yello`
 * console.log(lazy.ansiYellow('this is yellow'));
 * ```
 *
 * @param  {Function} `fn` Function that will be called only once.
 * @return {Function} Function that can be called to get the cached function
 * @api public
 */

function lazyCache(fn) {
  var cache = {};
  var lazy = function (name) {
    Object.defineProperty(lazy, camelcase(name), {
      get: getter
    });

    function getter () {
      if (cache.hasOwnProperty(name)) {
        return cache[name];
      }
      try {
        return (cache[name] = fn(name));
      } catch (err) {
        console.log(colors.ansiYellow(err));
        return;
      }
    };
    return getter;
  };
  return lazy;
}

/**
 * Used to camelcase the name to be stored on the `lazy` object.
 *
 * @param  {String} `str` String containing `_`, `.`, `-` or whitespace that will be camelcased.
 * @return {String} camelcased string.
 */

function camelcase(str) {
  return str.replace(/[_.-](\w|$)/g, function (_, first) {
    return first.toUpperCase();
  });
}


/**
 * Expose `lazyCache`
 */

module.exports = lazyCache;
