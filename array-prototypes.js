'use strict';

var bm = require('./blockmap'),
  blockMap = bm.blockMap,
  blockMapAlt = bm.blockMapAlt,
  keysUpArray = bm.keysUpArray,
  groupBy = bm.groupBy;

Array.prototype.blockMap = function (skip, callback) {
  return blockMap(this, skip, callback);
};

Array.prototype.blockMapAlt = function(skip, callback) {
  return this.blockMap(skip, function (val, idx, arr, meta) {
    var items = [];
    for (var i=0; i < meta.skip; i++) {
      items.push(arr[idx*meta.skip + i]);
    }
    return callback(items, idx, arr, meta);
  });
};

Array.prototype.keysUp = function () {
  return keysUpArray(this);
}

Array.prototype.groupBy = function (n) {
  return groupBy(this, n);
}


/**
 * The following are not genuine suggestions, 
 * and exist only for easy logging/testing in chains
 */

/**
 * For demonstration/test purposes only, calls a function
 * with the current array
 * @param  {Function} fn The function to call
 * @return {Array}      The original array (assumes unmodified)
 */
Array.prototype.chainify = function(fn) {
  fn.apply(null, arguments);
  return this;
};

Array.prototype.dump = function() {  
  var max = 10,
      set = this;
  if (set.length > max) {
    set = set.slice(0, max);
    set.push('...')
  }
  console.log(Array.prototype.join.call(arguments, ' '), set);
  return this;
};