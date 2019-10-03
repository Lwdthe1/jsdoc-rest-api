"use strict";

class ArticleApiController {
	/**
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

	/**
	 * @routeType GET
	 * @routePath /api/i/article/:id
	 * @routeKey Get Article
	 * @routeDescription Get an article
	 * @routeResponse Article object
	 */
	updateArticle(req, res, next) {
		// 1. Insert the user into db
		const dbArticle = this.articleDbDriver.getById(req.params.id);
		// 2. Respond with the article
		res.status(200).send(dbArticle);
	}

	/**
	 * @routeType DELETE
	 * @routePath /api/i/article/:id
	 * @routeKey Delete Article
	 * @routeDescription Delet an article
	 * @routeResponse Boolean
	 */
	deleteArticle(req, res, next) {
		// 1. Delete the article by its id
		this.articleDbDriver.deleteById(req.params.id);
		// 2. Respond with true
		res.status(200).send(true);
	}
}
module.exports = ArticleApiController;
