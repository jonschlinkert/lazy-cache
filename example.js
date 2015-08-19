var lazy = require('./')(require);
lazy('ansi-yellow', 'yellow');
lazy('glob');

console.log(lazy.glob.sync('*.js'));

lazy.glob('*.js', function (err, files) {
  console.log(lazy.yellow(files.join('\n')));
});
