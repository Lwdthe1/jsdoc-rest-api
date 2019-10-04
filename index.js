"use strict";

const generateRoutesMap = require("./lib/generateRoutesMap");
const attachExpressAppEndpoints = require("./lib/attachExpressAppEndpoints");

module.exports = {
	generateRoutes: generateRoutesMap,
	attachExpressAppEndpoints
};
