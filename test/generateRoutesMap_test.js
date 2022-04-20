"use stict";

const { assert } = require("chai");

const { generateRoutes } = require("../index");

describe("#generateRoutes()", function() {
	it("should generate mapping of api routes from jsdoc in all controllers", async () => {
		const expectedResult = [
			{
				fileName: "ArticleApiController.js",
				fileAbsolutePath: "/examples/generateRoutesMap/server/api/ArticleApiController.js",
				fileRootPath:
					"/Users/lincolndaniel/Documents/programming/jsdoc-rest-api/examples/generateRoutesMap/server/api/ArticleApiController.js",
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
							body: '{"title": "String", subtitle:"String", "content": "String"}',
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
				fileAbsolutePath: "/examples/generateRoutesMap/server/api/DiscussionApiController.js",
				fileRootPath:
					"/Users/lincolndaniel/Documents/programming/jsdoc-rest-api/examples/generateRoutesMap/server/api/DiscussionApiController.js",
				routes: {
					GET: {
						GET_DISCUSSION: {
							type: "GET",
							path: "/api/i/discussion/:id",
							key: "Get Discussion",
							description: "Get an discussion",
							respsonseType: "Discussion object",
							ctrl: "getDiscussion",
							ctrlClass: "DiscussionApiController"
						},
						GET_DISCUSSION_V2: {
							type: "GET",
							path: "/api/i/discussion/:id/v2",
							ctrl: "getDiscussionV2",
							ctrlClass: "DiscussionApiController",
							key: undefined,
							description: undefined,
							respsonseType: undefined
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
						},
						CREATE_DISCUSSION_V2: {
							type: "POST",
							path: "/api/i/discussion/v2",
							ctrl: "createDiscussionV2",
							ctrlClass: "DiscussionApiController",
							key: undefined,
							description: undefined,
							respsonseType: undefined
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
						},
						UPDATE_DISCUSSION_V2: {
							type: "PUT",
							path: "/api/i/discussion/:id/v2",
							ctrl: "updateDiscussionV2",
							ctrlClass: "DiscussionApiController",
							key: undefined,
							description: undefined,
							respsonseType: undefined
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
						},
						DELETE_DISCUSSION_V2: {
							type: "DELETE",
							path: "/api/i/discussion/:id/v2",
							ctrl: "deleteDiscussionV2",
							ctrlClass: "DiscussionApiController",
							key: undefined,
							description: undefined,
							respsonseType: undefined
						}
					}
				}
			}
		];

		const result = generateRoutes({
			source: "examples/generateRoutesMap/server/api/**/*Controller.js"
		});

		{
			const getComparableObj = result => {
				return JSON.parse(JSON.stringify(result)).map(r => {
					delete r.fileRootPath;

					return r;
				});
			};
			assert.deepEqual(getComparableObj(result), getComparableObj(expectedResult));
		}
		{
			const getComparablePath = fileRootPath => {
				const parts = fileRootPath.split("/examples");
				parts.shift();
				return parts.join("");
			};

			result.forEach((file, i) => {
				assert.equal(
					getComparablePath(file.fileRootPath),
					getComparablePath(expectedResult[i].fileRootPath)
				);
			});
		}
	});
});
