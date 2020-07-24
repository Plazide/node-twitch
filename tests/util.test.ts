import { parseArrayToQueryString, isNumber, parseOptions } from "../src/util";

describe.only("Unit tests for util functions", () => {
	test("should be a query string", () => {
		const result = parseArrayToQueryString("id", ["test"]);
		expect(result).toBe("id=test");
	});

	test("should check if string represents number", () => {
		expect(isNumber("we")).toBeFalsy();
		expect(isNumber("1")).toBeTruthy();
	});

	test("should properly parse an object to querystring", () => {
		const obj = { test: 1, hello: 2 };

		expect(parseOptions(obj)).toBe("test=1&hello=2");
	});
});
