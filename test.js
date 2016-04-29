'use strict';

require('mocha');
var assert = require('assert');
var lazyCache = require('./');

describe('lazy-cache', function() {
  afterEach(function() {
    delete require.cache[require.resolve('./index.js')];
    process.env.UNLAZY = false;
    lazyCache = require('./');
  });

  it('should return a function that lazyily requires a module', function() {
    var lazy = lazyCache(require);
    var yellow = lazy('ansi-yellow');
    assert.deepEqual(typeof yellow, 'function');
    assert.deepEqual(typeof yellow(), 'function');
  });

  it('should not invoke require until the module is used', function() {
    var calls = {};
    var lazy = lazyCache(function(name) {
      calls[name] = (calls[name] || 0) + 1;
      return require(name);
    });

    assert.deepEqual(calls, {});

    var yellow = lazy('ansi-yellow');

    if (process.env.TRAVIS) {
      assert.deepEqual(calls, {'ansi-yellow': 1});
    } else {
      assert.deepEqual(calls, {});
    }

    yellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    yellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    yellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    yellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });

  it('should add a property to the lazy function with the camelcased name', function() {
    var lazy = lazyCache(require);
    lazy('ansi-yellow');
    assert.deepEqual(typeof lazy.ansiYellow, 'function');
  });

  it('should only require a dependency once', function() {
    var calls = {};
    var lazy = lazyCache(function(name) {
      calls[name] = (calls[name] || 0) + 1;
      return require(name);
    });

    assert.deepEqual(calls, {});
    lazy('ansi-yellow');
    if (process.env.TRAVIS) {
      assert.deepEqual(calls, {'ansi-yellow': 1});
    } else {
      assert.deepEqual(calls, {});
    }

    lazy.ansiYellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });

  it('should allow loading a dependency immediately with `process.env.UNLAZY` setting', function() {
    process.env.UNLAZY = true;
    var calls = {};
    var lazy = lazyCache(function(name) {
      calls[name] = (calls[name] || 0) + 1;
      return require(name);
    });

    assert.deepEqual(calls, {});

    lazy('ansi-yellow');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });

  it('should support an alias as the second argument:', function() {
    var calls = {};
    var lazy = lazyCache(function(name) {
      calls[name] = (calls[name] || 0) + 1;
      return require(name);
    });

    assert.deepEqual(calls, {});
    lazy('ansi-yellow', 'yellow');
    if (process.env.TRAVIS) {
      assert.deepEqual(calls, {'ansi-yellow': 1});
    } else {
      assert.deepEqual(calls, {});
    }

    lazy.yellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });

  it('should support dot-notation in aliases', function() {
    var lazy = lazyCache(require);
    lazy('ansi-cyan', 'color.cyan');
    lazy('ansi-yellow', 'color.yellow');
    lazy('ansi-magenta', 'color.magenta');

    assert.deepEqual(typeof lazy.color, 'object');
    assert.deepEqual(typeof lazy.color.cyan, 'function');
    assert.deepEqual(typeof lazy.color.yellow, 'function');
    assert.deepEqual(typeof lazy.color.magenta, 'function');
  });

  it('should not use dot-notation in non-aliases', function() {
    var lazy = lazyCache(require);
    lazy('object.omit');
    lazy('object.pick');
    assert.deepEqual(typeof lazy.objectOmit, 'function');
    assert.deepEqual(typeof lazy.objectPick, 'function');
  });

  it('should support dot-notation when `process.env.UNLAZY` is used', function() {
    process.env.UNLAZY = true;

    var calls = {};
    var lazy = lazyCache(function(name) {
      calls[name] = (calls[name] || 0) + 1;
      return require(name);
    });

    assert.deepEqual(calls, {});

    lazy('ansi-cyan', 'color.cyan');
    lazy('ansi-yellow', 'color.yellow');
    lazy('ansi-magenta', 'color.magenta');

    assert.deepEqual(calls, {
      'ansi-cyan': 1,
      'ansi-yellow': 1,
      'ansi-magenta': 1
    });
    lazy.color.cyan('one');
    lazy.color.yellow('one');
    lazy.color.magenta('one');
    assert.deepEqual(calls, {
      'ansi-cyan': 1,
      'ansi-yellow': 1,
      'ansi-magenta': 1
    });
    lazy.color.cyan('two');
    lazy.color.yellow('two');
    lazy.color.magenta('two');
    assert.deepEqual(calls, {
      'ansi-cyan': 1,
      'ansi-yellow': 1,
      'ansi-magenta': 1
    });
    lazy.color.cyan('three');
    lazy.color.yellow('three');
    lazy.color.magenta('three');
    assert.deepEqual(calls, {
      'ansi-cyan': 1,
      'ansi-yellow': 1,
      'ansi-magenta': 1
    });
    lazy.color.cyan('four');
    lazy.color.yellow('four');
    lazy.color.magenta('four');
    assert.deepEqual(calls, {
      'ansi-cyan': 1,
      'ansi-yellow': 1,
      'ansi-magenta': 1
    });

    assert.deepEqual(typeof lazy.color, 'object');
    assert.deepEqual(typeof lazy.color.cyan, 'function');
    assert.deepEqual(typeof lazy.color.yellow, 'function');
    assert.deepEqual(typeof lazy.color.magenta, 'function');
  });
});
