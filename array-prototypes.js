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