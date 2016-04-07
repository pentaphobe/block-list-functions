'use strict';

/**
 * Perform `map()` on an array but with a predefined skip
 * size.  Given the parameter `skip`, each call will be 
 * `skip` entries ahead of the previous.
 * Callback parameters are identical to that of `map()`
 * The callback is also provided with an extra `meta` argument, 
 * which provides information about `skip` size, and whether the
 * current call is an *incomplete* (ie. the array size was not an
 * exact factor of `skip` so some arguments are missing)
 * 
 * @param {Array} arr the array to blockMap
 * @param {skip} skip how many items to skip
 * @param {Function} callback The function to call on every iteration (val, idx, arr, meta)
 */
function blockMap(arr, skip, callback) {  
  // performs no checks, for now assuming we're on `prototype`
  var len = arr.length,
    meta = {
      skip: skip,
      isIncomplete: false
    },
    result = [],
    idx = 0;

  for (var i=0; i < len; i += skip, idx++) {
    var val = arr[i];
    if (i + skip > len) {
      meta.isIncomplete = true;
    }
    result.push(callback(val, idx, arr, meta));
  }
  return result;
}

/**
 * For all entries which are also objects, take their
 * key-value pairs and insert them in the current one
 * 
 * @param  {Array} obj  The target array
 * @return {Object}     The result object
 */
function keysUp(obj) {
  // this could all be achieved using `blockReduce()` but I haven't
  // written it yet  :)
  
  var result = {};

  function isObject(obj) {
    // TODO: naive - needs fixing
    return typeof obj === 'object';
  }

  for (var k in obj) {
    var entry = obj[k];
    if (isObject(entry)) {
      for (var childKey in entry) {
        // TODO: check for collisions?
        result[childKey] = entry[childKey];
      }
    } else {
      result[k] = entry;
    }
  }
  return result;
}

function keysUpArray(arr) {
  // this could all be achieved using `blockReduce()` but I haven't
  // written it yet  :)
  
  var result = {};

  function isObject(obj) {
    // TODO: naive - needs fixing
    return typeof obj === 'object';
  }

  for (var i=0; i < arr.length; i++) {
    var entry = arr[i];
    if (isObject(entry)) {
      for (var childKey in entry) {
        // TODO: check for collisions?
        result[childKey] = entry[childKey];
      }
    } else {
      result[k] = entry;
    }
  }
  return result;  
}

/***
 * Alternative approach, we provide a method for clustering the incoming
 * stream into sub-lists which can then receive further processing
 */

function groupBy(arr, n) {
  var len = arr.length,
    result = [];
  
  for (var i=0; i < len; i += n) {
    var group = arr.slice(i, i+n);    
    result.push(group);
  }
  return result;
}

module.exports = {
  blockMap,
  keysUp, keysUpArray,
  groupBy
};