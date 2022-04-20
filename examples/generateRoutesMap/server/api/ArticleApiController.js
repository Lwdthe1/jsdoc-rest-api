"use strict";

class ArticleApiController {
	/**
	 * @apiType POST
	 * @apiPath /api/i/article
	 * @apiBody {"title": "String", subtitle:"String", "content": "String"}
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

	/**
	 * @apiPath PUT /api/i/article/:id
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

	/**
	 * @apiType DELETE
	 * @apiPath /api/i/article/:id
	 * @apiKey Delete Article
	 * @apiDescription Delet an article
	 * @apiResponse Boolean
	 */
	deleteArticle(req, res, next) {
		// 1. Delete the article by its id
		this.articleDbDriver.deleteById(req.params.id);
		// 2. Respond with true
		res.status(200).send(true);
	}
}
module.exports = ArticleApiController;
