import { parseArrayToQueryString, isNumber, parseOptions, parseMixedParam } from "../src/util";

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

	test("should parse mixed parameters properly", () => {
		expect(parseMixedParam({
			values: ["sacriel", "shroud"],
			stringKey: "user_login",
			numericKey: "user_id"
		})).toBe("user_login=sacriel&user_login=shroud");

		expect(parseMixedParam({
			values: "shroud",
			stringKey: "user_login",
			numericKey: "user_id"
		})).toBe("user_login=shroud");

		expect(parseMixedParam({
			values: [5023423, 242342],
			stringKey: "name",
			numericKey: "id"
		})).toBe("id=5023423&id=242342");
	});
});
