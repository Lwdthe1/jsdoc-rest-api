"use strict";

const express = require("express");
const jsdocRestApi = require("jsdoc-rest-api");
const app = express();

const PORT = process.env.PORT || 3200;
app.set("port", PORT);

// Attach all our supported HTTP endpoints to our ExpressJs app
jsdocRestApi.attachExpressAppEndpoints({
	app,
	source: "server/api/**/*Controller.js"
});

// Listen for incoming HTTP requests.
app.listen(PORT);

console.log(`Server is running at http://localhost:${PORT}`);
console.log(
	`Also visit http://localhost:${PORT}/bye \n\t and http://localhost:${PORT}/greet/your-name`
);
