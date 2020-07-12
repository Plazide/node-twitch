const methods = require("../src/methods");
const credentials = require("../data/apiUser.json");

test("should return access token", () => {
	const result = methods.getLocalAccessToken();
	expect(result).toBe(credentials.access_token);
});

test("should return refresh token", () => {
	const result = methods.getLocalRefreshToken();
	expect(result).toBe(credentials.refresh_token);
});

test("should return client id", () => {
	const result = methods.getLocalClientId();
	expect(result).toBe(credentials.client_id);
});

test("should return client secret", () => {
	const result = methods.getLocalClientSecret();
	expect(result).toBe(credentials.client_secret);
});

test("should be a query string", () => {
	const result = methods.parseArrayToQueryString("id", ["test"]);
	expect(result).toBe("id=test");
});
