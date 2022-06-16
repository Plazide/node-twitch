import TwitchApi from "../src/index";
import client from "../data/apiUser";
import open from "open";
import HttpServer from "../test-server/server";

jest.setTimeout(10000);

/* Unit tests */
describe("unit tests for endpoint NOT requiring user authentication.", () => {
	let api: TwitchApi,
		broadcasterId: string;

	beforeAll( () => {
		api = new TwitchApi({
			client_id: client.client_id,
			client_secret: client.client_secret
		});

		return api;
	});

	test("`getUsers` should return array of users", async () => {
		const result = await api.getUsers("iamstreaming");
		broadcasterId = result.data[0].id;

		expect(result.data[0].login).toBe("iamstreaming");
	});

	test("`getFollows` should return array of follows", async () => {
		const result = await api.getFollows({ to_id: 48504279 });

		expect(result.data.length).toBeGreaterThan(1);
	});

	test("`getStreams` should get array of streams", async () => {
		const result = await api.getStreams({ channels: ["shroud", "summit1g"] });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getGames` should return array of games", async () => {
		const result = await api.getGames("493057");

		expect(result.data).toHaveLength(1);
	});

	test("`getTopGames` should return array of games", async () => {
		const result = await api.getTopGames({ first: 1 });

		expect(result.data).toHaveLength(1);
	});

	test("`getVideos` should return array of videos", async () => {
		const result = await api.getVideos({ user_id: "48504279" });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getAllStreamTags` should return array of tags", async () => {
		const result = await api.getAllStreamTags({ first: 5 });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getStreamTags` should return array of tags", async () => {
		const result = await api.getStreamTags({ broadcaster_id: broadcasterId });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getChannelInformation` should return array with channel info", async () => {
		const result = await api.getChannelInformation({ broadcaster_id: broadcasterId });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`searchChannels` should return array of channels", async () => {
		const result = await api.searchChannels({ query: "PUBG" });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`searchCategories` should return array of games", async () => {
		const result = await api.searchCategories({ query: "programming" });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getGlobalBadges` should return array of badges", async () => {
		const result = await api.getGlobalBadges();

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getGlobalEmotes` should return array of emotes", async () => {
		const result = await api.getGlobalEmotes();

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getCheermotes` should return array of cheermotes", async () => {
		const result = await api.getCheermotes();

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getClips` should return array of clips", async () => {
		const result = await api.getClips({ broadcaster_id: broadcasterId });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getCodeStatus` should do something", async () => {
		const result = await api.getCodeStatus({ code: "asdasd", user_id: broadcasterId });

		expect(result).toBeDefined();
	});

	test("Should get channel emotes", async () => {
		const result = await api.getChannelEmotes(broadcasterId);

		expect(result.data).toBeInstanceOf(Array);
		expect(typeof result.template).toBe("string");
	});

	test("Should get channel badges", async () => {
		const result = await api.getChannelBadges(broadcasterId);

		expect(result.data).toBeInstanceOf(Array);
	});
});

describe("unit tests for endpoints requiring user authentication.", () => {
	const PORT = 5000;
	let api: TwitchApi,
		server: HttpServer,
		userId: string;

	beforeAll( async () => {
		server = new HttpServer({ port: PORT });
		server.start();

		api = new TwitchApi({
			client_id: client.client_id,
			client_secret: client.client_secret,
			redirect_uri: "http://localhost:" + PORT,
			scopes: client.scopes
		});

		await new Promise( async resolve => {
			const authUrl = api.generateAuthUrl();
			await open(authUrl);

			server.on("code", async code => {
				await api.getUserAccess(code);
				resolve(undefined);
			});
		});
	});

	afterAll( () => {
		server.stop();
	});

	test("`getCurrentUser` should return object representing the authenticated user", async () => {
		const result = await api.getCurrentUser();
		if(result && result.id)
			userId = result.id;

		expect(userId).toBeDefined();
	});

	test("`generateAuthUrl` should return valid url to authenticate user.", () => {
		const expected = "https://id.twitch.tv/oauth2/authorize?" +
			`client_id=${client.client_id}&` +
			"response_type=code&" +
			`redirect_uri=${encodeURIComponent("http://localhost:" + PORT)}&` +
			`scope=${client.scopes.join(" ")}`;

		const result = api.generateAuthUrl();
		expect(result).toBe(expected);
	});

	test("`getStreamKey` should return string", async () => {
		const result = await api.getStreamKey({ broadcaster_id: userId });

		expect(result).toEqual(expect.stringMatching(/^live_[0-9]*_[a-zA-Z0-9]*$/));
	});

	test("`getBitsLeaderboard` should return a `date_range` and array of positions in leaderboard", async () => {
		const result = await api.getBitsLeaderboard();

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getBannedUsers` should return array of bans", async () => {
		const result = await api.getBannedUsers({ broadcaster_id: userId });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`getStreamMarkers` should return array of stream markers", async () => {
		const result = await api.getStreamMarkers({ user_id: userId });

		expect(result).toBeDefined();
	});

	test("`getUserExtensions` should return array of extensions", async () => {
		const result = await api.getUserExtensions();

		expect(result).toBeDefined();
	});

	test("`getUserActiveExtensions` should return array of active extensions", async () => {
		const result = await api.getUserActiveExtensions();

		expect(result).toBeDefined();
	});

	test("`modifyChannelInformation`", async () => {
		const newTitle = "Working on a Twitch API wrapper...";
		await api.modifyChannelInformation({ broadcaster_id: userId, title: newTitle });
		const result = await api.getChannelInformation({ broadcaster_id: userId });

		expect(result.data[0].title).toBe(newTitle);
	});

	test("`updateUser` should update user", async () => {
		const description = "Web developer streaming fun side projects from time to time.";
		const result = await api.updateUser({ description });

		expect(result.data[0].description).toBe(description);
	});

	test("`createClip` should create clip", async () => {
		const stream = await api.getStreams({ channel: userId });
		const result = await api.createClip({ broadcaster_id: userId });

		if(stream.data.length > 0)
			expect(result.data).toBeInstanceOf(Array);
		else
			expect(result.data).toBe(undefined);
	});

	test("`getModerators` should return moderators", async () => {
		const result = await api.getModerators({ broadcaster_id: userId });

		expect(result.data).toBeInstanceOf(Array);
	});

	test("`replaceStreamTags` should replace stream tags", async () => {
		let success = false;

		try{
			await api.replaceStreamTags({ broadcaster_id: userId });
			success = true;
		}catch(err){
			console.error(err);
			success = false;
		}

		expect(success).toBe(true);
	});

	test("`startCommercial` should start a commercial", async () => {
		const result = await api.startCommercial({ broadcaster_id: userId, length: 30 });

		expect(result).toBeDefined();
	});
});
