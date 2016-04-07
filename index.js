'use strict';

var bm = require('./blockmap'),
  extensions = require('./array-prototypes');


/**
 * Basic skip test
 */
var items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log('\n## Basic blockMap()');
console.log(items + '.blockMap(3):')
items.blockMap(3, function(val, idx, arr, meta) {
  console.log(idx + ' : ' + val, meta.isIncomplete ? 'incomplete':'');
});

console.log(items + '.blockMapAlt(3):')
items.blockMapAlt(3, function(vals, idx, arr, meta) {
  console.log(idx + ' : ' + vals, meta.isIncomplete ? 'incomplete':'');
});


/**
 * Array to object
 */
var keyValue = [
  'key', 23,
  'other', 42,
  'more', 'yay!',
  'foo', 'bar',
  'bar', false];

console.log('\n## Array pairs to object');
console.log('grouping generated:', keyValue.blockMapAlt(2, function(vals) {
  return [vals[0], vals[1]];
}));

console.log('object generated:', keyValue.blockMapAlt(2, function(vals) {
  var result = {};
  result[vals[0]] = vals[1];
  return result;
}).keysUp());


/********* 
 * WOULD ALSO BE USEFUL WITH OBSERVERS, GIVE THAT A LOOK
 */


// So you can start by grouping
console.log('\n## Group By');
for (var i=2; i < 5; i++) {
  console.log(i + ':', items.groupBy(i))
}

// then use classic methods:
console.log('\n## Cluster group');
var vectorLengths = items
            .groupBy(2)                   // [0,1,2,3, 4] -> [[0,1], [2,3], [4]]
            .filter( pair => pair.length === 2 )      // remove entries not containing 2 items
            .map( (pair) =>                 // calculate 2D vector length
              Math.sqrt(pair[0]*pair[0] + pair[1]*pair[1]) 
            );
console.log(vectorLengths);

console.log('\n## Average 3 columns by group');
var average3D = items
            .groupBy(3)
            .filter( trip => trip.length === 3 )
            .reduce( (last, cur, idx, arr) =>
              cur.map( (val, idx) => (last[idx] || 0) + val )
            , []);
console.log(average3D);