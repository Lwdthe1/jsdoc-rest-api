"use strict";

class HelloWorld {
	/**
	 * @apiPath GET /
	 */
	home(req, res, next) {
		res.send(
			"Hello, world! <br/><br/> See examples/attachExpressAppEndpoints/workingWebServer/server/api/helloWorldApiController.js for the source jsdoc API definitions and to add your own. <br/><br/> Also add some POST, PUT, and DELETE API endpoints and test using a tool like Postman."
		);
	}

	/**
	 * @apiPath GET /bye
	 * @apiDescription Says bye to the world.
	 */
	bye(req, res) {
		res.send("Bye, world!");
	}
}

/**
 * @apiPath GET /greet/:name
 * @apiDescription Prints a greeting with the provided "name" path param.
 */
HelloWorld.greet = function(req, res) {
	res.send(`Hello, ${req.params.name}! Your REST API is up and running thanks to jsdoc-rest-api`);
};

module.exports = HelloWorld;
