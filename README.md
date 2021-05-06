This library can generate a map of your REST API endpoints from your JsDoc and use that map to automatically hook up your endpoints to your ExpressJs app when starting your REST API web server.

<div class="badge-examples__ExampleTable-sc-1m4e1ck-0 hgKsAa"><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub issues badge" src="https://img.shields.io/github/issues/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub forks badge" src="https://img.shields.io/github/forks/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub stars badge" src="https://img.shields.io/github/stars/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub license badge" src="https://img.shields.io/github/license/Lwdthe1/jsdoc-rest-api"></span><span style="height:20px; display:inline; margin-right:20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="Twitter badge" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FLwdthe1%2Fjsdoc-rest-api"></span></tbody></table>



- [Install](#install)
- [Usage](#usage)
  - [Methods](#methods)
  - [Requirements](#requirements)
- [Supported annonations](#supported-annonations)
  - [Use case](#use-case)
    - [#generateRoutes()](#-generateroutes--)
    - [Some terminology](#some-terminology)
      - [controller](#controller)
      - [ctrl](#ctrl)
    - [#attachExpressAppEndpoints()](#-attachexpressappendpoints--)
      - [See it in action](#see-it-in-action)
- [Why use this and how to make the most of it to automate the setup of your HTTP server for a REST API](#why-use-this-and-how-to-make-the-most-of-it-to-automate-the-setup-of-your-http-server-for-a-rest-api)
  - [Enter `jsdoc-rest-api`!](#enter--jsdoc-rest-api--)
- [Tests](#tests)
- [Contributing](#contributing)

## Install

`npm install --save jsdoc-rest-api`

## Usage
```javascript
const expressApp = require('express')()
const jsdocRestApi = require('jsdoc-rest-api')
const PORT = process.env.PORT || 3100

// Attach all our supported HTTP endpoint controllers
jsdocRestApi.attachExpressAppEndpoints({
  app: expressApp,
  source: 'server/api/**/*Controller.js'
})

expressApp.all('*', (req, res) => {
	res.status(404).send('Not found');
})

expressApp.listen(PORT)
console.log(`REST API server is running at http:localhost:${PORT}`)
```


### Methods

There are two functions you can make use of, and one of them relies on the other:

1. `generateRoutes()`
2. `attachExpressAppEndpoints()`

The first one, `generateRoutes()`, will simply return a mapping of all your defined REST API endpoints from your JsDoc by traversing your code.

The second one, `attachExpressAppEndpoints()`, allows you to easily attach all of your defined REST API endpoints from your JsDoc to your ExpressJs app without ever having to write `app.get(...)`, `app.post(...)` (etc.) for each endpoint again.

### Requirements

You must have files with the appropriate JsDoc annonations on functions. Example:

```
class ArticleApiController {
	/**
		* @apiType PUT
		* @apiPath /api/i/article/:id
		* @apiBody {"title": "String", "subtitle":"String", "content": "String"}
		* @apiKey Create Article
		* @apiDescription Create a new article
		* @apiResponse Article object
		*/
	updateArticle(req, res, next) {
		// 1. Update the article in the db
		const updatedDbArticle = this.articleDbDriver.updateById(req.params.id, req.body);
		// 2. Respond with the new article
		res.status(200).send(updatedDbArticle);
	}
}

module.exports = ArticleApiController
```

## Supported annonations

<table>
	<thead>
		<tr>
			<th>Tag</th>
			<th>Description</th>
			<th>Supported values</th>
			<th>Optionality</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td style="color: #1abc9c">@apiType</td>
			<td>The HTTP verb for the api route</td>
			<td>GET, POST, PUT, or DELETE</td>
			<td>Required</td>
		</tr>
		<tr>
			<td style="color: #1abc9c">@apiPath</td>
			<td>
				The HTTP endpoint for the api route. 
			</td>
			<td>String</td>
			<td>Required</td>
		</tr>
		<tr>
			<td>@apiBody</td>
			<td>The HTTP expected body data for the api route.</td>
			<td>String|JSON</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@apiKey</td>
			<td>A key by which this route may be identified by consumers of your api.</td>
			<td>String</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@apiDescription</td>
			<td>A description of this route for consumers of your api.</td>
			<td>String</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@apiResponse</td>
			<td>The type of the response that the api client should expect for this route.</td>
			<td>String</td>
			<td>Optional</td>
		</tr>
	</tbody>
</table>

### Use case

With your jsDoc annonations in place for your REST API handlers across your codebase, you're ready to use this library to hook up your REST API web server. Let's look at how you can make use of the methods above.

#### #generateRoutes()

To get an array of maps that group all endpoints of a controller file together, simply do the following:

```
const jsdocRestApi = require('jsdoc-rest-api')

// Assuming you've defined all of your API controllers in `server/api/**`
const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({ source: "server/api/**/*Controller.js" })


/**
Expected result:
[
	{
		fileName: "ArticleApiController.js",
		fileAbsolutePath: "/server/api/ArticleApiController.js",
		routes: {
			GET: { /** ... */ },
			POST: { /** ... */ },
			PUT: {
				UPDATE_ARTICLE: {
					type: "PUT",
					path: "/api/i/article/:id",
					key: "Create Article",
					description: "Create a new article",
					respsonseType: "Article object",
					body: '{"title": "String", "subtitle":"String", "content": "String"}',
					bodyObj: { title: "String", subtitle: "String", content: "String" },
					ctrl: "updateArticle",
					ctrlClass: "ArticleApiController"
				}
			},
			DELETE: { /** ... */ },
		},
	},
	// And other controllers that are found matching the source search
	{
		fileName: "XyzApiController.js",
		fileAbsolutePath: "/server/api/XyzApiController.js",
		routes: {
			GET: { /** ... */ },
			POST: { /** ... */ },
			PUT: { /** ... */ },
			DELETE: { /** ... */ },
		},
	}
]
*/
```

#### Some terminology

Using the example output above, let's establish some terminology.

##### controller

In the output you see there, each element in the array is referred to as a `controller`. A controller is just a module that contains a group of (supposedly) related REST API endpoints, or `routes`. `ArticleApiController` is one controller that has a group of routes related to handling requests for blog articles, and `XyzApiController` is another controller responsible to handling requests for another type of entity in your application.

You can have all your routes in a single controller, but that can get messy. We suggest grouping related routes under a controller and creating many groups as you add more resource types, e.g. users, articles, etc., to you application. You may have a UserApiController for all routes related to users and another for all routes related to articles. Of course, you don't have to call your files "ApiController"; that's just a convention. What we do suggest, though, is to have a consistent suffix for your controller file names to make the logic simple when providing the [glob](https://docs.python.org/3/library/glob.html) for the library to traverse your code looking for your controllers.

##### ctrl

`ctrl` on each route in a controller's group of `routes` is just a function defined on the `controller` module. A route's `ctrl` is what handles incoming requests to your REST API web server for that route.

So if a `PUT` request comes into your server for `/api/i/article/article1`, it would be handled by an instance of your `ArticleApiController` controller with a call to `#updateArticle()`, which is the defined `ctrl` for that route.

#### #attachExpressAppEndpoints()

Getting an array of mappings for your REST API endpoints is cool and all, but it gets even better. If you don't want to worry about manually typing `app.get()`, `app.post()`, `app.put()`, and `app.delete()` again for each endpoint your server can handle, this method is the one for you.

Call this method when starting your ExpressJs HTTP server in order to automatically attach all of your REST API endpoints.

`attachExpressAppEndpoints()` takes a config object with `app`, your ExpressJs app instance, and `source`, where to look for your REST API jsDoc definitions in your codebase.

You can also optionally provide `getControllerInstance()`, a callback that will be called whenever an endpoint is requested by a client of your REST API in order to get the correct object on which to call the required handler for the incoming request. If `getControllerInstance` is not provided, we will first check on the controller's prototype for the target handler. If the prototype does not have the handler as a function, we will default to calling the static function. If you would like to check for the static function before the prototype's function, that would be a perfect reason to provide your own `getControllerInstance()` callback; the target `controller` object and `ctrl` key will always be provided so you can run checks to help you decide.

##### See it in action

Please see the `attachExpressAppEndpoints/workingWebServer` example folder for how you can use this method. It will definitely cut down on your development time and the tedium of manually typing boilerplate for each endpoint on your server.

Change directory to that folder, run `npm install` then `npm start` and visit the link it prints in the console to see the power of this library in action.

## Why use this and how to make the most of it to automate the setup of your HTTP server for a REST API

Say you have a web API hosted by your own HTTP server. When you start your server, you specify functionality that your web API can handle for a REST client; perhaps a client can use your API to create an article and get an article from your server's database. However, that's not the case until you write some logic to tell your server how to handle incoming HTTP requests so that they are routed to the correct controllers.

You may currently be using Express to run your HTTP server. In which case, you would do something like this:

```

const express = require('express')
const app = express()

conts articleDbDriver = require('./articleDbDriver.js)

app.post('/api/i/article', (req, res, next) => {
	// 1. Insert the new article into db
	const newDbArticle = articleDbDriver.insert(req.body);
	// 2. Respond with the new article
	res.status(201).send(newDbArticle);
})

app.get('/api/i/article/:id', (req, res, next) => {
	// 1. Insert the user into db
	const dbArticle = articleDbDriver.getById(req.params.id);
	// 2. Respond with the article
	res.status(200).send(dbArticle);
})

```

As your web app gets more popular and complicated, you'll find yourself adding more api endpoints to that express app of yours. It can get very messy very quickly. It can also become extremely tedious to always type out boilerplate to add new endpoints. I've experienced this first hand across many projects I've built from scratch. That's why I finally decided to figure out a way to automate the boilerplate code as well as keep my code clean and manageable. I arrived to a much better solution by using OOP and the concept of API endpoint controllers.

Take a look as the class below. It's an API endpoint controller class. It's job is to handle all incoming HTTP requests relating to storing, fetching, and manipulating blog articles. It may have hundreds of possible endpoints it can handle, but we're only showing 2 here for illustration purposes.

```

"use strict";

class ArticleApiController {
	createArticle(req, res, next) {
		// 1. Insert the new article into db
		const newDbArticle = this.articleDbDriver.insert(req.body);
		// 2. Respond with the new article
		res.status(201).send(newDbArticle);
	}

	getArticle(req, res, next) {
		// 1. Insert the user into db
		const dbArticle = this.articleDbDriver.getById(req.params.id);
		// 2. Respond with the article
		res.status(200).send(dbArticle);
	}

}
module.exports = ArticleApiController;

```

Now when we start a server, it'll look something like this:

```

const express = require('express')
const app = express()

const articleApiController = new require('./ArticleApiController')

app.post('/api/i/article', (req, res, next) => {
	articleApiController.createArticle(req, res, next)
})

app.get('/api/i/article/:id', (req, res, next) => {
	articleApiController.getArticle(req, res, next)
})

```

So we've solved the problem of keeping our code clean and manageable by encapsulating the logic of each endpoint into a dedicated controller. But we're still writing out each endpoint with the boilerplate code. Imagine we have tens of `POST` and tens of `GET` API endpoints. We'd have to type out each one as we do above. There's a better way.

We could just create an array defining all of the `POST` endpoints and another array of all the `GET` endpoints and loop over each to create the handlers like so:

```

const express = require('express')
const app = express()

const articleApiController = new require('./ArticleApiController')

const postEndpoints = [
	{path: '/api/i/article', ctrl: 'createArticle'},
	// other POST endpoints ...
]

const getEndpoints = [
	{path: '/api/i/article/:id', ctrl: 'getArticle'},
	// other GET endpoints ...
]

postEndpoints.forEach((endpointDef) => {
	app.post(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

getEndpoints.forEach((endpointDef) => {
	app.get(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

```

Now we can define a bunch of endpoints and provide their respective handlers as `ctrl` in their definitions. When a request comes in, they'll be handled by the correct controller. But we can do even better.

At this point, we have achieved a level of minimized boilerplate code writing. However, another problem/inconvenience still exists: we are defining all of our endpoints in one place and their controllers elsewhere in another file. We should be able to define our endpoints right next to their controllers.

### Enter `jsdoc-rest-api`!

Let's return to our `ArticleApiController` class (which is hosted in the file `server/api/ArticleApiController.js`) where we have defined our API endpoints for blog articles. Using this `jsdoc-rest-api`, we can easily define each API endpoint on its controller using JSDoc with the supported annonations:

```

"use strict";

class ArticleApiController {

    /**
    	* @apiType GET
    	* @apiPath /api/i/article/:id
    	* @apiKey Get Article
    	* @apiDescription Get an article
    	* @apiResponse Article object
    	*/
    getArticle(req, res, next) {
    	// 1. Insert the user into db
    	const dbArticle = this.articleDbDriver.getById(req.params.id);
    	// 2. Respond with the article
    	res.status(200).send(dbArticle);
    }

    \**
    	* @apiType POST
    	* @apiPath /api/i/article
    	* @apiBody {"title": "String", "subtitle":"String", "content": "String"}
    	* @apiKey Create Article
    	* @apiDescription Create a new article
    	* @apiResponse Article object
    	*/
    createArticle(req, res, next) {
    	// 1. Insert the new article into db
    	const newDbArticle = this.articleDbDriver.insert(req.body);
    	// 2. Respond with the new article
    	res.status(201).send(newDbArticle);
    }

}

module.exports = ArticleApiController;

```

Now starting our server can look something like this:

```

const express = require('express')
const app = express()

const jsdocRestApi = require('jsdoc-rest-api')

const articleApiController = new require('./ArticleApiController')

const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({ source: "server/api/**/*Controller.js" })

// Assuming that ArticleApiController is first
const articleApiEndpointsGrouped = allApiEndpointsGrouped[0].routes
const getEndpoints = Object.keys(articleApiEndpointsGrouped.GET)
const postEndpoints = Object.keys(articleApiEndpointsGrouped.POST)
const putEndpoints = Object.keys(articleApiEndpointsGrouped.PUT)
const deleteEndpoints = Object.keys(articleApiEndpointsGrouped.DELETE)

getEndpoints.forEach((endpointDef) => {
	app.get(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

postEndpoints.forEach((endpointDef) => {
	app.post(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

putEndpoints.forEach((endpointDef) => {
	app.put(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

deleteEndpoints.forEach((endpointDef) => {
	app.delete(endpointDef.path, (req, res, next) => {
		articleApiController[endpointDef.ctrl](req, res, next)
	})
})

```

The key line here is:

```

const allApiEndpoints = jsdocRestApi.generateRoutes({ source: "server/api/**/*Controller.js" })

```

What that does is traverse all of your files looking for all that are descedants of the `api/` folder and end with `Controller.js`. When found, each file is searched for endpoint definitions as described above. All of the endpoints found in a controller file are grouped together and all groups are returned as objects in a single array like so:

```

/**
Expected result:
[
	{
		fileName: "ArticleApiController.js",
		fileAbsolutePath: "/server/api/ArticleApiController.js",
		routes: {
			GET: {
				GET_ARTICLE: {
					type: "GET",
					path: "/api/i/article/:id",
					key: "Get Article",
					description: "Get an article",
					respsonseType: "Article object",
					ctrl: "getArticle",
					ctrlClass: "ArticleApiController"
				}
			},
			POST: {
				CREATE_ARTICLE: {
					type: "POST",
					path: "/api/i/article",
					key: "Create Article",
					description: "Create a new article",
					respsonseType: "Article object",
					body: '{"title": "String", "subtitle":"String", "content": "String"}',
					bodyObj: { title: "String", subtitle: "String", content: "String" },
					ctrl: "createArticle",
					ctrlClass: "ArticleApiController"
				}
			},
			PUT: {
				/** ... */
			},
			DELETE: {
				/** ... */
			}
		}
	}
]
*/

```

With that, we can do something like this on the next line to hook up our HTTP server to handle incoming request for the articles api controller class:

```

const articleApiEndpointsGrouped = allApiEndpointsGrouped[0].routes // Assuming that ArticleApiController is first

```

Of course, that's a simplified example of what you can do with this library. In my own servers, I have automated the creation of my entire HTTP server using this library because it tells me which endpoints are supported across my entire codebase, which controller classes handle those endpoints, and, for each endpoint, which function to call on a controller to handle the request.

You can do the same pretty easily by using the `attachExpressAppEndpoints()` method in this library.

With that, your server is ready to handle all incoming requests for any API endpoints defined in an ApiController file. Of course, you don't have to call your files "ApiController"; that's just what I've chosen to do. Whatever, you call it, make sure you provide the correct glob as the `source` config field when calling the `jsdocRestApi.generateRoutes()` or `jsdocRestApi.attachExpressAppEndpoints()` functions as illustrated above.

## Tests

We use mocha and chai. Run `npm test` to test the generators.

## Contributing

Feel free to open a pull request.
