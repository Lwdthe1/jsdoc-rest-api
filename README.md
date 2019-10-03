<table class="badge-examples__ExampleTable-sc-1m4e1ck-0 hgKsAa"><tbody><tr><td><span display="inline" height="20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub issues badge" src="https://img.shields.io/github/issues/Lwdthe1/jsdoc-rest-api"></span></td></tr><tr><td><span display="inline" height="20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub forks badge" src="https://img.shields.io/github/forks/Lwdthe1/jsdoc-rest-api"></span></td></tr><tr><td><span display="inline" height="20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub stars badge" src="https://img.shields.io/github/stars/Lwdthe1/jsdoc-rest-api"></span></td></tr><tr><td><span display="inline" height="20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="GitHub license badge" src="https://img.shields.io/github/license/Lwdthe1/jsdoc-rest-api"></span></td></tr><tr><td><span display="inline" height="20px" class="common__BadgeWrapper-v13icv-3 GSKuB"><img alt="Twitter badge" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2FLwdthe1%2Fjsdoc-rest-api"></span></td></tr></tbody></table>

This packagae is a helper that generates a map of your rest api from your JsDoc.

## Install

`npm install --save jsdoc-rest-api`

## Usage

You must have files with the appropriate JsDoc annonations on functions. Example:

```
class ArticleApiController {
	/**
		* @routeType PUT
		* @routePath /api/i/article/:id
		* @routeBody {"title": "String", "subtitle":"String", "content": "String"}
		* @routeKey Create Article
		* @routeDescription Create a new article
		* @routeResponse Article object
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

Then do the following to get an array of maps that group all endpoints of a controller file together:

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
	}
]
*/
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
			<td>@routeType</td>
			<td>The HTTP verb for the api route</td>
			<td>`GET`, `POST`, `PUT`, `DELETE`</td>
			<td>Required</td>
		</tr>
		<tr>
			<td>@routePath</td>
			<td>The HTTP endpoint for the api route.</td>
			<td>`String`</td>
			<td>Required</td>
		</tr>
		<tr>
			<td>@routeBody</td>
			<td>The HTTP expected body data for the api route.</td>
			<td>`String|JSON`</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@routeKey</td>
			<td>A key by which this route may be identified by consumers of your api.</td>
			<td>`String`</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@routeDescription</td>
			<td>A description of this route for consumers of your api.</td>
			<td>`String`</td>
			<td>Optional</td>
		</tr>
		<tr>
			<td>@routeResponse</td>
			<td>The type of the response that the api client should expect for this route.</td>
			<td>`String`</td>
			<td>Optional</td>
		</tr>
	</tbody>
</table>

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
    	* @routeType GET
    	* @routePath /api/i/article/:id
    	* @routeKey Get Article
    	* @routeDescription Get an article
    	* @routeResponse Article object
    	*/
    getArticle(req, res, next) {
    	// 1. Insert the user into db
    	const dbArticle = this.articleDbDriver.getById(req.params.id);
    	// 2. Respond with the article
    	res.status(200).send(dbArticle);
    }

    \**
    	* @routeType POST
    	* @routePath /api/i/article
    	* @routeBody {"title": "String", "subtitle":"String", "content": "String"}
    	* @routeKey Create Article
    	* @routeDescription Create a new article
    	* @routeResponse Article object
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

const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({ source: "server/api/\**/*Controller.js" })
const articleApiEndpointsGrouped = allApiEndpointsGrouped[0].routes // Assuming that ArticleApiController is first
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

const allApiEndpoints = jsdocRestApi.generateRoutes({ source: "server/api/\**/*Controller.js" })

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

Of course, that's a simplified example of what you can do with this library. In my own servers, I have automated the creation of my entire HTTP server using this library because it tells me which endpoints are supported across my entire codebase, which controller classes handle those endpoints, and for each endpoint, which function to call on a controller to handle the request.

You can do the same pretty easily because the library tells you the absolute path to each api controller in the groups it returns; see the `fileAbsolutePath` field in each object. You can use that to `require(...)` the controller file and call the defined function for the endpoint, as specified in the `ctrl` field of each route definition, on that controller for the incoming HTTP request.

Here's some pseudo code for doing exactly that by leveraging the dynamic nature of Javascript syntax.

```

const express = require('express')
const jsdocRestApi = require('jsdoc-rest-api')
const app = express()

const PORT = process.env.PORT
app.set('port', PORT || 3100)


const allApiEndpointsGrouped = jsdocRestApi.generateRoutes({ source: "server/api/\**/*Controller.js" })

// Loop over the controller groups
allApiEndpointsGrouped.forEach((controllerGroup) => {
// Loop over the HTTP verb groups
Object.keys(controllerGroup).forEach((httpVerb) => {
const httpVerbLowercase = httpVerb.toLowerCase()

    	const endpoints = Object.values(controllerGroup[httpVerb])
    	endpoints.forEach((endpointDef) => {
    		// This is the same as `app.get(path, (req, res, next) => {})`,
    		// `app.post`, `app.put`, or `app.delete` as above.
    		app[httpVerbLowercase](endpointDef.path, (req, res, next) => {
    			// You may need to do some extra path manipulation
    			// to get the absolute path to work in the `require()` call
    			// depending on where your root file is located in your file structure.
    			require(controllerGroup.fileAbsolutePath)[endpointDef.ctrl](req, res, next)
    		})
    	})
    })

})

// Listen for incoming HTTP requests.
app.listen(PORT)

```

With that, your server is ready to handle all incoming requests for any API endpoints defined in an ApiController file. Of course, you don't have to call your files "ApiController"; that's just what I've chosen to do. Whatever, you call it, make sure you provide the correct glob as the `source` config field when calling the `jsdocRestApi.generateRoutes()` function as illustrated above.

## Tests

We use mocha and chai. Run `npm test` to test the generators.

## Contributing

Feel free to open a pull request.
