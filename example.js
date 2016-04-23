var utils = require('./')(require);
utils('glob');

/**
 * `utils.glob` is a getter that when called
 * will require in `glob`
 */

console.log(utils.glob.sync('*.js'));
utils.glob('*.js', function(err, files) {
  console.log(files.join('\n'));
});

/**
 * Browserify-friendly example
 */

var utils = require('./')(require);
var fn = require;
require = utils;
require('ansi-yellow', 'yellow');
require('glob');
require = fn;

console.log(utils.glob.sync('*.js'));
utils.glob('*.js', function(err, files) {
  console.log(files.join('\n'));
});
