"use stict";

const { assert } = require("chai");

const { attachExpressAppEndpoints } = require("../index");
const testHelper = require("./TestHelper").instance();

describe("#attachExpressAppEndpoints()", function() {
	it(
		"should attach express middlewares for GET, POST, PUT, and DELETE endpoints from api endpoints generated from the provided source using jsdoc.",
		testHelper.testWithStubs(async () => {
			const expressApp = {
				get: testHelper.spy(),
				post: testHelper.spy(),
				put: testHelper.spy(),
				delete: testHelper.spy()
			};
			const fakeReq = { params: { id: "prop_id_a" }, body: {} };
			const fakeRes = { status: () => fakeRes, send: () => {} };
			const fakeNext = testHelper.spy(err => {
				console.error(err.stack);
			});

			const getControllerInstance = testHelper.spy(
				({ controller, controllerFileName, req, res }) => {
					assert.isTrue(
						controllerFileName === "ArticleApiController.js" ||
							controllerFileName === "DiscussionApiController.js"
					);

					assert(controller);
					assert.deepEqual(
						controller,
						require(`../examples/generateRoutesMap/server/api/${controllerFileName}`)
					);

					assert.deepEqual(req, fakeReq);
					assert.deepEqual(res, fakeRes);

					try {
						return new controller();
					} catch (err) {
						return controller;
					}
				}
			);

			attachExpressAppEndpoints({
				source: "examples/generateRoutesMap/server/api/**/*Controller.js",
				app: expressApp,
				getControllerInstance
			});

			assert.deepEqual(
				testHelper.mapSpyCallsArgs(expressApp.get, args => {
					assert.equal(args.length, 2);

					assert.isFunction(args[1]);
					assert.equal(args[1].length, 3);

					return [args[0], true];
				}),
				[
					["/api/i/article/:id", true],
					["/api/i/discussion/:id", true],
					["/api/i/discussion/:id/v2", true]
				]
			);

			const lastGetCallArgsCb = expressApp.get.lastCall.args[1];
			const lastPostCallArgsCb = expressApp.post.lastCall.args[1];
			const lastPutCallArgsCb = expressApp.put.lastCall.args[1];
			const lastDeleteCallArgsCb = expressApp.delete.lastCall.args[1];

			lastGetCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastPostCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastPutCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastDeleteCallArgsCb(fakeReq, fakeRes, fakeNext);

			await testHelper.delayedPromise(1000);

			assert.equal(getControllerInstance.callCount, 4);
			assert.equal(fakeNext.callCount, 0);

			// -- Now make one of the controllers throw an error
			// to test that the next middleware is called

			testHelper
				.stub(getControllerInstance.lastCall.args[0].controller.discussionDbDriver, "updateById")
				.callsFake(() => {
					throw new Error("Forced error");
				});

			lastGetCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastPostCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastPutCallArgsCb(fakeReq, fakeRes, fakeNext);
			lastDeleteCallArgsCb(fakeReq, fakeRes, fakeNext);

			await testHelper.delayedPromise(1000);

			assert.equal(getControllerInstance.callCount, 8);
			assert.equal(fakeNext.callCount, 1);

			// This is expected because the controller's field that is being accessed is undefined
			assert.deepEqual(
				testHelper.mapSpyCallsArgs(fakeNext, args => {
					return args[0].message;
				}),
				["Forced error"]
			);
		})
	);
});
