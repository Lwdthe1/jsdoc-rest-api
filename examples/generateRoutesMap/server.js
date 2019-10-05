"use strict";

const path = require("path");
const express = require("express");
const jsdocRestApi = require("../index");
const app = express();

const PORT = process.env.PORT;
app.set("port", PORT || 3100);

const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({
	source: "server/api/**/*Controller.js"
});

/**
 * Returns the absolute path of the provided target path from the root directory.
 * @param {String} targetPath
 */
function absolutePathFromRoot(targetPath) {
	// You may need to do some extra path manipulation
	// to get the absolute path to work in the `require()` call
	// depending on where you place this function in your file structure.
	return path.join(__dirname, targetPath);
}

// Loop over the controller groups
allApiEndpointsGrouped.forEach(controllerGroup => {
	// Loop over the HTTP verb groups
	Object.keys(controllerGroup).forEach(httpVerb => {
		const httpVerbLowercase = httpVerb.toLowerCase();

		const endpoints = Object.values(controllerGroup[httpVerb].routes);
		endpoints.forEach(endpointDef => {
			// This is the same as `app.get(path, (req, res, next) => {})`,
			// `app.post`, `app.put`, or `app.delete` respectively.
			app[httpVerbLowercase](endpointDef.path, (req, res, next) => {
				require(absolutePathFromRoot(controllerGroup.fileAbsolutePath))[endpointDef.ctrl](
					req,
					res,
					next
				);
			});
		});
	});
});

// Listen for incoming HTTP requests.
app.listen(PORT);
