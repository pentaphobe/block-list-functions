
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

Array.prototype.keysUp = function () {
	return keysUpArray(this);
}

/**
 * Array to object
 */
var keyValue = ['key', 23,
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

Array.prototype.groupBy = function (n) {
	return groupBy(this, n);
}

// So you can start by grouping
console.log('\n## Group By');
for (var i=2; i < 5; i++) {
	console.log(i + ':', items.groupBy(i))
}

// then use classic methods:
console.log('\n## Cluster group');
var vectorLengths = items
						.groupBy(2)										// [0,1,2,3, 4] -> [[0,1], [2,3], [4]]
						.filter( pair => pair.length === 2 )			// remove entries not containing 2 items
						.map( (pair) => 								// calculate 2D vector length
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