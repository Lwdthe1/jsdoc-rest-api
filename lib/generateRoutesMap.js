"use strict";

const mapFiles = require("map-files");

const controllerRoutesGenerator = require("./generator/controllerRoutesGenerator");

/**
 *
 * @param {{
	source: String // Must be a glob from the root folder
 * }} config
 */
function generateJson(config) {
	const { source: sourceFilesGlob } = config;
	const container = [];

	mapFiles(sourceFilesGlob, {
		renameKey: file => generateJsonForFile(file, container)
	});

	return container;
}

function generateJsonForFile(file, container) {
	const routes = controllerRoutesGenerator.genRoutes(file);
	if (!routes) {
		return;
	}

	container.push({
		fileName: file.basename,
		fileAbsolutePath: file.history[0].replace(file.base, ""),
		fileRootPath: file.path,
		routes
	});
}

module.exports = generateJson;
