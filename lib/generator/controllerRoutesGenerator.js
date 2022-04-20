"use strict";

const changeCase = require("change-case");
const jsdoc = require("jsdoc-api");
const json5 = require("json5");
const arrays = require("../utils/arrays");

function genControllerRoutes(file) {
	const filename = file.basename;
	const filenameCleaned = changeCase.camelCase(filename.replace("Controller.js", ""));

	let fileComments;
	if (file.content.includes("@apiPath")) {
		fileComments = jsdoc.explainSync({ source: file.content });
	} else {
		return;
	}

	const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };

	const usedControllers = [];

	fileComments
		.filter(blockComment => {
			const { comment, tags, meta } = blockComment;

			return (
				comment &&
				meta &&
				meta.code &&
				tags &&
				comment.startsWith("/**") &&
				(meta.code.type === "MethodDefinition" ||
					meta.code.type === "FunctionExpression" ||
					meta.code.type === "FunctionDeclaration" ||
					meta.code.type === "ArrowFunctionExpression") &&
				tags.some(({ originalTitle, text }) => {
					return originalTitle.startsWith("apiPath") && !!text.trim();
				})
			);
		})
		.forEach(blockComment => {
			const {
				apiType = { text: "GET" /* default to GET */ },
				apiPath = {},
				apiKey = {},
				apiDescription = {},
				apiField = {},
				apiBody = {},
				apiResponse = {}
			} = arrays.mapFirstsByValueOf(blockComment.tags, "originalTitle");

			const apiCtrl = blockComment.name;
			const memberOf = blockComment.memberof;

			let apiPathStr = apiPath.text;
			let apiTypeCaps;
			let apiPathParts = apiPathStr.split(" ");
			if (apiPathParts.length === 2) {
				apiTypeCaps = apiPathParts[0];
				apiPathStr = apiPathParts[1];
			}

			if (!apiTypeCaps) {
				apiTypeCaps = apiType.text.toUpperCase();
			}

			const uniqueApiTypePath = `${apiTypeCaps}: ${apiPathStr}`;
			const apiFieldKey = changeCase.snakeCase(apiField.text || apiCtrl).toUpperCase();

			if (!routes[apiTypeCaps]) {
				throw new Error(`${apiCtrl.text} has invalid @apiType: ${apiTypeCaps}`);
			}

			const container = routes[apiTypeCaps];

			if (usedControllers.includes(apiCtrl)) {
				throw new Error(
					`${apiCtrl} ctrl already used in ${filenameCleaned} controller api apis generation.`
				);
			}

			if (usedControllers.includes(uniqueApiTypePath)) {
				throw new Error(
					`${uniqueApiTypePath} api path already used in ${filenameCleaned} controller api apis generation.`
				);
			}

			if (container[apiFieldKey]) {
				throw new Error(
					`${apiFieldKey} field already used in ${filenameCleaned} controller api apis generation.`
				);
			}

			const apiBodyStr = (apiBody.text || "").trim();
			let apiBodyObj;
			try {
				apiBodyObj = json5.parse(apiBodyStr);
			} catch (err) {}

			container[apiFieldKey] = {
				type: apiTypeCaps,
				path: apiPathStr,
				key: apiKey.text,
				description: apiDescription.text,
				respsonseType: apiResponse.text,

				ctrl: apiCtrl,
				ctrlClass: memberOf
			};

			if (apiBodyStr) {
				container[apiFieldKey].body = apiBodyStr;
				container[apiFieldKey].bodyObj = apiBodyObj;
			}

			usedControllers.push(uniqueApiTypePath);
			usedControllers.push(apiCtrl.text);
		});

	return routes;
}

module.exports = {
	genRoutes: function(file) {
		try {
			return genControllerRoutes(file);
		} catch (err) {
			console.error("[jsdoc-rest-api : ERROR]", err.stack);
		}
	}
};
