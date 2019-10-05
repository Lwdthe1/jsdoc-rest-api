"use strict";

const path = require("path");
const express = require("express");
const jsdocRestApi = require("../../index");
const app = express();

const PORT = process.env.PORT;
app.set("port", PORT || 3100);

// Attach all our supported HTTP endpoints to our ExpressJs app
jsdocRestApi.attachExpressAppEndpoints({
	app,
	source: "server/api/**/*Controller.js"
});

// Listen for incoming HTTP requests.
app.listen(PORT);
