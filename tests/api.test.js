const TwitchApi = require("../index");
const client = require("../data/apiUser.json");

const api = new TwitchApi({
	client_id: client.client_id,
	client_secret: client.client_secret,
	isApp: true,
	scopes: ["bits:read", "channel:read:subscriptions"]
});

/* Unit tests */
test("should be falsy", () => {
	const result = api._isListeningFor("error");

	expect(result).toBeFalsy();
});

test("should be truthy", () => {
	api.on("error", () => {
		console.log("error");
	});

	const result = api._isListeningFor("error");
	expect(result).toBeTruthy();
});

test("should throw error", () => {
	expect( () => {
		api._error("Error");
	}).toThrow();
});

test("accesss token should be defined", async () => {
	const result = await api._getAppAccessToken();

	console.log(result);
	expect(result.access_token).toBeDefined();
});

test("should return array of single username", async () => {
	const result = await api.getUsers("iamstreaming");

	expect(result.data[0].login).toBe("iamstreaming");
});

test("should return array", async () => {
	const result = await api.getFollows({ to_id: 48504279 });

	expect(result.data.length).toBeGreaterThan(1);
});

test("should be array with length 0", async () => {
	const result = await api.getSubsById(48504279);

	expect(result.data).toHaveLength(0);
});

test("should get array of streams", async () => {
	const result = await api.getStreams({ first: 1 });

	expect(result.data).toBeInstanceOf(Array);
	expect(result.data).toHaveLength(1);
});

test("should return array of videos", async () => {
	const result = await api.customRequest("/videos?user_id=48504279");

	expect(result.data).toBeInstanceOf(Array);
});

test("should return a game", async () => {
	const result = await api.getGames("493057");

	expect(result.data).toHaveLength(1);
});

test("should return array with one item", async () => {
	const result = await api.getTopGames({ first: 1 });

	expect(result.data).toHaveLength(1);
});

test("should return array", async () => {
	const result = await api.getVideos({ user_id: "48504279" });

	expect(result.data).toBeInstanceOf(Array);
});
