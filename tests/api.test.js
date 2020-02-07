const TwitchApi = require("../index");
const client = require("../data/apiUser.json");

const api = new TwitchApi({
	client_id: client.client_id,
	client_secret: client.client_secret,
	isApp: true,
	scopes: ["bits:read", "channel:read:subscriptions"]
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
