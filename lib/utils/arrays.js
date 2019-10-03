"use strict";

function mapFirstsByValueOf(arr, key, createKeyValueCb) {
  return arr.reduce(function(map, el) {
    if (!map[el[key]]) {
      // set the first occurrence of the object by the key
      // as the value in the map for the provided key
      map[el[key]] = createKeyValueCb ? createKeyValueCb(el) : el;
    }

    return map;
  }, {});
}

module.exports = {
  mapFirstsByValueOf
};
