"use strict";

const changeCase = require("change-case");
const jsdoc = require("jsdoc-api");
const arrays = require("../utils/arrays");

function genControllerRoutes(file) {
	const filename = file.basename;
	const filenameCleaned = changeCase.camelCase(filename.replace("Controller.js", ""));

	let fileComments;
	if (file.content.includes("@routeType")) {
		fileComments = jsdoc.explainSync({ source: file.content });
	} else {
		return;
	}

	const routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
	const httpTypes = ["GET", "POST", "PUT", "DELETE"];

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
				meta.code.type === "MethodDefinition" &&
				tags.some(({ originalTitle, text }) => {
					return originalTitle.startsWith("routePath") && !!text.trim();
				})
			);
		})
		.forEach(blockComment => {
			const {
				routeType = {},
				routePath = {},
				routeKey = {},
				routeDescription = {},
				routeField = {},
				routeBody = {},
				routeResponse = {}
			} = arrays.mapFirstsByValueOf(blockComment.tags, "originalTitle");

			const routeCtrl = blockComment.name;
			const memberOf = blockComment.memberof;

			const routeTypeCaps = routeType.text.toUpperCase();
			const routeFieldKey = changeCase.snakeCase(routeField.text || routeCtrl).toUpperCase();
			const routePathStr = routePath.text;
			const uniqueRouteTypePath = `${routeTypeCaps}: ${routePathStr}`;

			if (!httpTypes.includes(routeTypeCaps)) {
				throw new Error(`${routeCtrl.text} has invalid @routeType: ${routeTypeCaps}`);
			}

			const container = routes[routeTypeCaps];

			if (usedControllers.includes(routeCtrl)) {
				throw new Error(
					`${routeCtrl} ctrl already used in ${filenameCleaned} controller api routes generation.`
				);
			}

			if (usedControllers.includes(uniqueRouteTypePath)) {
				throw new Error(
					`${uniqueRouteTypePath} route path already used in ${filenameCleaned} controller api routes generation.`
				);
			}

			if (container[routeFieldKey]) {
				throw new Error(
					`${routeFieldKey} field already used in ${filenameCleaned} controller api routes generation.`
				);
			}

			const routeBodyStr = routeBody.text;
			let routeBodyObj;
			try {
				routeBodyObj = JSON.parse(routeBodyStr);
			} catch (err) {}

			container[routeFieldKey] = {
				type: routeTypeCaps,
				path: routePathStr,
				key: routeKey.text,
				description: routeDescription.text,
				respsonseType: routeResponse.text,
				body: routeBodyStr,
				bodyObj: routeBodyObj,
				ctrl: routeCtrl,
				ctrlClass: memberOf
			};

			usedControllers.push(uniqueRouteTypePath);
			usedControllers.push(routeCtrl.text);
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
