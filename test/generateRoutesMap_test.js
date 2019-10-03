"use stict";

const { assert } = require("chai");

const { generateRoutes } = require("../index");

describe("#generateRoutes()", function() {
	it("should generate mapping of api routes from jsdoc in all controllers", async () => {
		const expectedResult = [
			{
				fileName: "ArticleApiController.js",
				fileAbsolutePath: "/test/testFiles/api/ArticleApiController.js",
				routes: {
					GET: {
						UPDATE_ARTICLE: {
							type: "GET",
							path: "/api/i/article/:id",
							key: "Get Article",
							description: "Get an article",
							respsonseType: "Article object",
							ctrl: "updateArticle",
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
					DELETE: {
						DELETE_ARTICLE: {
							type: "DELETE",
							path: "/api/i/article/:id",
							key: "Delete Article",
							description: "Delet an article",
							respsonseType: "Boolean",
							ctrl: "deleteArticle",
							ctrlClass: "ArticleApiController"
						}
					}
				}
			},
			{
				fileName: "DiscussionApiController.js",
				fileAbsolutePath: "/test/testFiles/api/DiscussionApiController.js",
				routes: {
					GET: {
						UPDATE_DISCUSSION: {
							type: "GET",
							path: "/api/i/discussion/:id",
							key: "Get Discussion",
							description: "Get an discussion",
							respsonseType: "Discussion object",
							ctrl: "updateDiscussion",
							ctrlClass: "DiscussionApiController"
						}
					},
					POST: {
						CREATE_DISCUSSION: {
							type: "POST",
							path: "/api/i/discussion",
							key: "Create Discussion",
							description: "Create a new discussion",
							respsonseType: "Discussion object",
							body: '{"title": "String", "subtitle":"String", "content": "String"}',
							bodyObj: { title: "String", subtitle: "String", content: "String" },
							ctrl: "createDiscussion",
							ctrlClass: "DiscussionApiController"
						}
					},
					PUT: {
						UPDATE_DISCUSSION: {
							type: "PUT",
							path: "/api/i/discussion/:id",
							key: "Create Discussion",
							description: "Create a new discussion",
							respsonseType: "Discussion object",
							body: '{"title": "String", "subtitle":"String", "content": "String"}',
							bodyObj: { title: "String", subtitle: "String", content: "String" },
							ctrl: "updateDiscussion",
							ctrlClass: "DiscussionApiController"
						}
					},
					DELETE: {
						DELETE_DISCUSSION: {
							type: "DELETE",
							path: "/api/i/discussion/:id",
							key: "Delete Discussion",
							description: "Delet an discussion",
							respsonseType: "Boolean",
							ctrl: "deleteDiscussion",
							ctrlClass: "DiscussionApiController"
						}
					}
				}
			}
		];

		assert.deepEqual(
			generateRoutes({ source: "test/testFiles/api/**/*Controller.js" }),
			expectedResult
		);
	});
});
