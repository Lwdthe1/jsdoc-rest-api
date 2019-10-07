"use strict";

const genRoutes = require("../lib/generateRoutesMap");
const functions = require("../lib/utils/functions");

const promise = callback => {
	return new Promise(resolve => resolve()).then(callback);
};

/**
 *
 * @param {{
	app: Express,
	source: String,
	getControllerInstance?: ({controller, ctrl, controllerFileName, req, res}) => Object
 * }} config
 */
function attachExpressAppEndpoints({ app, source, getControllerInstance = undefined }) {
	const allApiEndpointsGrouped = genRoutes({
		source
	});

	if (!getControllerInstance) {
		getControllerInstance = ({ controller, ctrl }) => {
			try {
				// First, try to instantiating the controller if it has the desired ctrl member function
				if (functions.isType(controller.prototype[ctrl])) {
					return new controller();
				} else {
					return controller;
				}
			} catch (err) {
				return controller;
			}
		};
	}

	// Loop over the controller groups
	allApiEndpointsGrouped.forEach(controllerGroup => {
		const groupRoutes = controllerGroup.routes;
		const fileRootPath = controllerGroup.fileRootPath;
		const fileName = controllerGroup.fileName;
		// Loop over the HTTP verb groups
		Object.keys(groupRoutes).forEach(httpVerb => {
			const httpVerbLowercase = httpVerb.toLowerCase();

			const endpoints = Object.values(groupRoutes[httpVerb]);
			endpoints.forEach(endpointDef => {
				// This is the same as `app.get(path, (req, res, next) => {})`,
				// `app.post`, `app.put`, or `app.delete` respectively.
				app[httpVerbLowercase](endpointDef.path, (req, res, next) => {
					try {
						promise(() => {
							return getControllerInstance({
								controller: require(fileRootPath),
								ctrl: endpointDef.ctrl,
								controllerFileName: fileName,
								req,
								res
							})[endpointDef.ctrl](req, res, next);
						}).catch(next);
					} catch (err) {
						next(err);
					}
				});
			});
		});
	});
}

module.exports = attachExpressAppEndpoints;
