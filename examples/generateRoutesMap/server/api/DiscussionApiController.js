"use strict";

const DiscussionApiController = {
	discussionDbDriver: {
		insert: () => {},
		getById: () => {},
		updateById: () => {},
		deleteById: () => {}
	},
	/**
	 * @apiType POST
	 * @apiPath /api/i/discussion
	 * @apiBody {"title": "String", "subtitle":"String", "content": "String"}
	 * @apiKey Create Discussion
	 * @apiDescription Create a new discussion
	 * @apiResponse Discussion object
	 */
	createDiscussion(req, res, next) {
		// 1. Insert the new discussion into db
		const newDbDiscussion = this.discussionDbDriver.insert(req.body);
		// 2. Respond with the new discussion
		res.status(201).send(newDbDiscussion);
	},

	/**
	 * @apiType PUT
	 * @apiPath /api/i/discussion/:id
	 * @apiBody {"title": "String", "subtitle":"String", "content": "String"}
	 * @apiKey Create Discussion
	 * @apiDescription Create a new discussion
	 * @apiResponse Discussion object
	 */
	updateDiscussion(req, res, next) {
		// 1. Update the discussion in the db
		const updatedDbDiscussion = this.discussionDbDriver.updateById(req.params.id, req.body);
		// 2. Respond with the new discussion
		res.status(200).send(updatedDbDiscussion);
	},

	/**
	 * @apiType GET
	 * @apiPath /api/i/discussion/:id
	 * @apiKey Get Discussion
	 * @apiDescription Get an discussion
	 * @apiResponse Discussion object
	 */
	getDiscussion(req, res, next) {
		// 1. Insert the user into db
		const dbDiscussion = this.discussionDbDriver.getById(req.params.id);
		// 2. Respond with the discussion
		res.status(200).send(dbDiscussion);
	},

	/**
	 * @apiType DELETE
	 * @apiPath /api/i/discussion/:id
	 * @apiKey Delete Discussion
	 * @apiDescription Delet an discussion
	 * @apiResponse Boolean
	 */
	deleteDiscussion(req, res, next) {
		// 1. Delete the discussion by its id
		this.discussionDbDriver.deleteById(req.params.id);
		// 2. Respond with true
		res.status(200).send(true);
	},

	/**
	 * @apiPath POST /api/i/discussion/v2
	 */
	createDiscussionV2(req, res, next) {
		// 1. Insert the new discussion into db
		const newDbDiscussion = this.discussionDbDriver.insert(req.body);
		// 2. Respond with the new discussion
		res.status(201).send(newDbDiscussion);
	},

	/**
	 * @apiPath PUT /api/i/discussion/:id/v2
	 */
	updateDiscussionV2(req, res, next) {
		// 1. Update the discussion in the db
		const updatedDbDiscussion = this.discussionDbDriver.updateById(req.params.id, req.body);
		// 2. Respond with the new discussion
		res.status(200).send(updatedDbDiscussion);
	},

	/**
	 * @apiPath /api/i/discussion/:id/v2
	 */
	getDiscussionV2(req, res, next) {
		// 1. Insert the user into db
		const dbDiscussion = this.discussionDbDriver.getById(req.params.id);
		// 2. Respond with the discussion
		res.status(200).send(dbDiscussion);
	},

	/**
	 * @apiPath DELETE /api/i/discussion/:id/v2
	 */
	deleteDiscussionV2(req, res, next) {
		// 1. Delete the discussion by its id
		this.discussionDbDriver.deleteById(req.params.id);
		// 2. Respond with true
		res.status(200).send(true);
	}
};
module.exports = DiscussionApiController;
