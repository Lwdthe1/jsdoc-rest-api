"use strict";

function isFunc(functionToCheck) {
	if (!functionToCheck) return false;
	const getType = {};
	const toString = getType.toString.call(functionToCheck);

	return toString === "[object Function]" || toString === "[object AsyncFunction]" || false;
}

module.exports = {
	isType: isFunc
};
