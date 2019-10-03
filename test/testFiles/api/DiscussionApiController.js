"use strict";

class DiscussionApiController {
	/**
	 * @routeType POST
	 * @routePath /api/i/discussion
	 * @routeBody {"title": "String", "subtitle":"String", "content": "String"}
	 * @routeKey Create Discussion
	 * @routeDescription Create a new discussion
	 * @routeResponse Discussion object
	 */
	createDiscussion(req, res, next) {
		// 1. Insert the new discussion into db
		const newDbDiscussion = this.discussionDbDriver.insert(req.body);
		// 2. Respond with the new discussion
		res.status(201).send(newDbDiscussion);
	}

	/**
	 * @routeType PUT
	 * @routePath /api/i/discussion/:id
	 * @routeBody {"title": "String", "subtitle":"String", "content": "String"}
	 * @routeKey Create Discussion
	 * @routeDescription Create a new discussion
	 * @routeResponse Discussion object
	 */
	updateDiscussion(req, res, next) {
		// 1. Update the discussion in the db
		const updatedDbDiscussion = this.discussionDbDriver.updateById(req.params.id, req.body);
		// 2. Respond with the new discussion
		res.status(200).send(updatedDbDiscussion);
	}

	/**
	 * @routeType GET
	 * @routePath /api/i/discussion/:id
	 * @routeKey Get Discussion
	 * @routeDescription Get an discussion
	 * @routeResponse Discussion object
	 */
	updateDiscussion(req, res, next) {
		// 1. Insert the user into db
		const dbDiscussion = this.discussionDbDriver.getById(req.params.id);
		// 2. Respond with the discussion
		res.status(200).send(dbDiscussion);
	}

	/**
	 * @routeType DELETE
	 * @routePath /api/i/discussion/:id
	 * @routeKey Delete Discussion
	 * @routeDescription Delet an discussion
	 * @routeResponse Boolean
	 */
	deleteDiscussion(req, res, next) {
		// 1. Delete the discussion by its id
		this.discussionDbDriver.deleteById(req.params.id);
		// 2. Respond with true
		res.status(200).send(true);
	}
}
module.exports = DiscussionApiController;
