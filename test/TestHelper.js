const sinon = require("sinon");
const sinonTest = require("sinon-test")(sinon);
sinon.test = sinonTest;
const TestHelper = class {
	testWithStubs(testCb, opts = {}) {
		const self = this;
		return sinon.test(function() {
			// Add spy and stub methods to the testHelper
			self.spy = this.spy;
			self.stub = this.stub;

			if (opts.stubAwsSqsFuncs) {
				// Stub aws sqs funcs by default
				self.stubAwsSqsFuncs(this);
			}

			this.clock.restore();
			return testCb.call(this);
		});
	}

	mapSpyCallsArgs(spy, shaperCb, opts = { print: false, sorter: undefined }) {
		let arr = spy.getCalls().map(call => {
			if (shaperCb) {
				return shaperCb(call.args);
			} else {
				return call.args;
			}
		});

		if (opts.sorter) {
			arr = arr.sort(opts.sorter);
		}

		if (opts.print) {
			this.printJson(arr);
		}

		return arr;
	}

	delayedPromise(millis = 0) {
		return new Promise(resolve => {
			setTimeout(resolve, millis);
		});
	}

	printJson(obj) {
		console.log(
			JSON.stringify(
				obj,
				(k, v) => {
					if (v === undefined) return null;
					return v;
				},
				4
			)
		);
	}

	static instance() {
		return new this();
	}
};

module.exports = TestHelper;
