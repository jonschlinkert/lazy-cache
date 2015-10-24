/**
 * The easiest way to add this file is to do:
 *
 * ```sh
 * $ npm i -g lazy-cache-cli && lazy
 * ```
 * To do it manually:
 *
 * 1. Add a file named `utils.js` to your project.
 * 2. Copy the contents of this file (below this comment)
 *    into `utils.js`
 * 3. Change the dependencies where it says
 *    "your dependencies here" your project's actual dependencies
 */
'use strict';


/**
 * Module dependencies
 */

var utils = require('lazy-cache')(require);

/**
 * Temporarily re-assign `require` to trick browserify and
 * webpack into reconizing lazy dependencies.
 *
 * This tiny bit of ugliness has the huge dual advantage of
 * only loading modules that are actually called at some
 * point in the lifecycle of the application, whilst also
 * allowing browserify and webpack to find modules that
 * are depended on but never actually called.
 */

var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */


// __(your dependencies here)__
require('ansi-yellow')


/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
