'use strict';

/* deps: mocha */
var assert = require('assert');
var lazyCache = require('./');

describe('lazy-cache', function () {
  it('should return a function that lazyily requires a module', function () {
    var lazy = lazyCache(require);
    var yellow = lazy('ansi-yellow');
    assert.deepEqual(typeof yellow, 'function');
    assert.deepEqual(typeof yellow(), 'function');
  });

  it('should add a property to the lazy function with the camelcased name', function () {
    var lazy = lazyCache(require);
    lazy('ansi-yellow');
    assert.deepEqual(typeof lazy.ansiYellow, 'function');
  });

  it('should only require a dependency once', function () {
    var calls = {};
    var lazy = lazyCache(function (mod) {
      calls[mod] = (calls[mod] || 0) + 1;
      return require(mod);
    });

    assert.deepEqual(calls, {});
    lazy('ansi-yellow');
    assert.deepEqual(calls, {});

    lazy.ansiYellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.ansiYellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });

  it('should allow loading a dependency immediately with `unlazy` option', function() {
    var calls = {};
    var lazy = lazyCache(function(mod) {
      calls[mod] = (calls[mod] || 0) + 1;
      return require(mod);
    }, {unlazy: true});

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

  it('should support passing an alias as the second argument:', function () {
    var calls = {};
    var lazy = lazyCache(function (mod) {
      calls[mod] = (calls[mod] || 0) + 1;
      return require(mod);
    });

    assert.deepEqual(calls, {});
    lazy('ansi-yellow', 'yellow');
    assert.deepEqual(calls, {});

    lazy.yellow('one');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('two');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('three');
    assert.deepEqual(calls, {'ansi-yellow': 1});
    lazy.yellow('four');
    assert.deepEqual(calls, {'ansi-yellow': 1});
  });
});
