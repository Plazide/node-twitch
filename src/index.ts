/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import fetch from "node-fetch";
import { EventEmitter } from "events";
import { parseMixedParam, parseOptions, isNumber } from "./util";
import { Scope } from "./types/scopes";
import { User } from "./types/objects";
import { AuthEvent } from "./types/events";
import {
	TwitchApiConfig,
	BaseOptions,
	GetAllStreamTagsOptions,
	GetBitsLeaderboardOptions,
	GetFollowsOptions,
	GetStreamsOptions,
	GetVideosOptions,
	GetSubsOptions,
	SearchChannelsOptions,
	SearchCategoriesOptions,
	GetStreamTagsOptions,
	GetBannedUsersOptions,
	GetExtensionTransactionsOptions
} from "./types/options";
import {
	APIBitsLeaderboardResponse,
	APIFollowResponse,
	APIGameResponse,
	APIStreamResponse,
	APITagResponse,
	APIUserResponse,
	APIVideoResponse,
	APISubResponse,
	APIChannelResponse,
	APIBanResponse,
	APIExtensionTransactionResponse
} from "./types/responses";

/** Twitch API */
export default class TwitchApi extends EventEmitter{
	client_secret: string;
	client_id: string;

	user?: User;
	isApp?: boolean;
	access_token?: string;
	refresh_token?: string;
	scopes?: Scope[];
	redirect_uri?: string;
	base: string;
	refresh_attempts: number;
	ready: boolean;

	constructor(config: TwitchApiConfig){
		super();

		this.client_secret = config.client_secret;
		this.client_id = config.client_id;
		this.isApp = config.isApp;
		this.access_token = config.access_token;
		this.refresh_token = config.refresh_token;
		this.scopes = config.scopes;
		this.redirect_uri = config.redirect_uri;
		this.base = "https://api.twitch.tv/helix";
		this.refresh_attempts = 0;
		this.ready = false;

		if(config.isApp && config.access_token)
			this._error("Option isApp is set to true while an `access_token` is provided. Choose one method of authentication, do not use both.");

		if(config.isApp)
			console.warn("The `isApp` option has been deprecated. The Twitch API now requires all requests to use OAuth. That means, if you omit the `access_token` option, an app access token will be automatically fetched. That renders the option useless, and it will be removed in future versions.");

		this._init();
	}

	/*
	****************
	PRIVATE METHODS
	****************
	*/

	/** Initialize the api.
	 * @internal
	*/
	private async _init(): Promise<void>{
		if(this.access_token){
			const currentUser = await this.getCurrentUser();
			this.user = currentUser;
		}
	}

	/** Throw an error
	 * @internal
	*/
	private _error(message: string): void{
		throw new Error(message);
	}

	/** Get an app access token
	 * @internal
	 */
	private async _getAppAccessToken(): Promise<string>{
		const data = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "client_credentials",
			scope: this.scopes?.join(" ")
		};
		const endpoint = "https://id.twitch.tv/oauth2/token";
		const response = await fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const result = await response.json();
		return result.access_token;
	}

	/** Refresh the access token
	 * @internal
	*/
	private async _refresh(): Promise<void>{
		// Check if the current refresh token is valid.
		const valid = await this._validate();
		if(valid) return;

		// Cancel execution and throw error if refresh token is not present.
		if(!this.refresh_token) return this._error("Refresh token is not set.");

		const refreshData = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "refresh_token",
			refresh_token: encodeURIComponent(this.refresh_token)
		};

		const url = "https://id.twitch.tv/oauth2/token";
		const options = {
			method: "POST",
			body: JSON.stringify(refreshData),
			headers: {
				"Content-Type": "application/json"
			}
		};

		const response = await fetch(url, options);
		const result: AuthEvent = await response.json();

		const accessToken = result.access_token;
		const refreshToken = result.refresh_token;

		// Set the newly fetched access and refresh tokens.
		this.access_token = accessToken || this.access_token;
		this.refresh_token = refreshToken || this.refresh_token;

		if(this._isListeningFor("refresh")) this.emit("refresh", result);

		if(!accessToken)
			this.refresh_attempts++;
	}

	/** Checks if an event is handled or not
	 * @internal
	*/
	private _isListeningFor(event: string): boolean{
		return this.eventNames().includes(event);
	}

	/** Check validity of refresh token
	 * @internal
	*/
	private async _validate(): Promise<boolean>{
		const url = "https://id.twitch.tv/oauth2/validate";
		const options = {
			headers: {
				"Authorization": `OAuth ${this.access_token}`
			}
		};

		const response = await fetch(url, options);
		const result = await response.json();

		const message = result.message;
		const valid = response.status === 200;

		if(message === "missing authorization token") this._error(message);

		return valid;
	}

	/** Make a get request to the twitch api
	 * @internal
	*/
	private async _get<T>(endpoint: string): Promise<T>{
		if(!this.access_token){
			const accessToken = await this._getAppAccessToken();
			this.access_token = accessToken;
		}

		const url = this.base + endpoint;
		const options = {
			method: "GET",
			headers: {
				"Client-ID": this.client_id,
				"Authorization": `Bearer ${this.access_token}`
			}
		};

		const response = await fetch(url, options);

		if(response.status === 401){
			await this._refresh();
			return this._get(endpoint);
		}

		const result: T = await response.json();
		return result;
	}

	/** Send a post request to the Twitch API
	 * @internal
	 */
	private async _post(endpoint: string, data: Record<string, unknown>): Promise<any>{
		if(endpoint.substring(0, 1) !== "/") this._error("Endpoint must start with a '/' (forward slash)");

		const url = this.base + endpoint;
		const options = {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.access_token}`,
				"Client-ID": this.client_id
			}
		};

		try{
			const response = await fetch(url, options);
			return response.json();
		}catch(err){
			const status = err.status;

			if(status === 401)
				return this._post(endpoint, options);

			this._error(err);
		}
	}

	/** Check if the current instance was created with a certain scope
	 * @internal
	 */
	private _hasScope(scope: Scope): boolean{
		if(this.scopes)
			return this.scopes?.includes(scope);

		return false;
	}

	/*
	**************
	PUBLIC METHODS
	**************
	*/

	/***************
	Authentication.
	***************/

	/** Generate url required to get permission from users */
	generateAuthUrl(): string{
		const base = "https://id.twitch.tv/oauth2/authorize";
		const clientId = `client_id=${this.client_id}`;
		const redirectUri = `redirect_uri=${encodeURIComponent("" + this.redirect_uri)}`;
		const responseType = "response_type=code";
		const scope = `scope=${this.scopes?.join(" ")}`;

		const url = `${base}?${clientId}&${responseType}&${redirectUri}&${scope}`;
		return url;
	}

	/** Get user access from a code generated by visiting the url created by `generateAuthUrl` */
	async getUserAccess(code: string): Promise<void>{
		const endpoint = "https://id.twitch.tv/oauth2/token" +
			`?client_id=${this.client_id}` +
			`&client_secret=${this.client_secret}` +
			`&code=${code}` +
			"&grant_type=authorization_code" +
			`&redirect_uri=${this.redirect_uri}`;

		const response = await fetch(endpoint, { method: "POST" });
		const result: AuthEvent = await response.json();

		if(result.access_token) this.access_token = result.access_token;
		if(result.refresh_token) this.refresh_token = result.refresh_token;
		this.emit("user_auth", result);
	}

	/************************************
	Methods NOT requiring user permissions
	*************************************/

	/** Get games by their name or id */
	async getGames(
		games: string | number | string[] | number[]
	): Promise<APIGameResponse>{
		if(!Array.isArray(games) && typeof games !== "string" && typeof games !== "number")
			this._error("games must be either a string or number or an array of strings and/or numbers");

		let query = "?";
		query += parseMixedParam({ values: games, stringKey: "name", numericKey: "id" });

		const endpoint = "/games" + query;
		const result = await this._get<APIGameResponse>(endpoint);

		return result;
	}

	async getTopGames(options?: BaseOptions): Promise<APIGameResponse>{
		const query = options ? parseOptions(options) : "";
		const endpoint = `/games/top?${query}`;

		return this._get<APIGameResponse>(endpoint);
	}

	/** Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice. */
	async getUsers(
		ids: string | number | string[] | number[]
	): Promise<APIUserResponse>{
		let query = "?";

		if(Array.isArray(ids)){
			query += parseMixedParam({ values: ids, stringKey: "login", numericKey: "id" });
		}else{
			const key = isNumber("" + ids) ? "id" : "login";
			query += `${key}=${ids}`;
		}

		const endpoint = "/users" + query;
		return this._get<APIUserResponse>(endpoint);
	}

	/** Get follows to or from a channel. Must provide either from_id or to_id. */
	async getFollows(options?: GetFollowsOptions): Promise<APIFollowResponse>{
		let query = "?";

		if(options)
			query += parseOptions<GetFollowsOptions>(options);

		const endpoint = `/users/follows${query}`;

		return this._get<APIFollowResponse>(endpoint);
	}

	/** Get one or more live streams */
	async getStreams(options?: GetStreamsOptions): Promise<APIStreamResponse>{
		let query = "?";
		const endpoint = "/streams";

		if(!options) return this._get<APIStreamResponse>(endpoint);

		const{ channel, channels } = options;

		if(channel){
			const key = isNumber(channel) ? "user_id" : "user_login";

			query += `${key}=${channel}&`;
		}

		if(channels)
			query += parseMixedParam({
				values: channels,
				stringKey: "user_login",
				numericKey: "user_id"
			});

		query += parseOptions(options);
		return this._get<APIStreamResponse>(endpoint + query);
	}

	async getAllStreamTags(options?: GetAllStreamTagsOptions): Promise<APITagResponse>{
		const query = options ? `?${parseOptions(options)}` : "";
		const endpoint = `/tags/streams${query}`;

		return this._get<APITagResponse>(endpoint);
	}

	async getStreamTags(options: GetStreamTagsOptions): Promise<APITagResponse>{
		const query = "?" + parseOptions(options);
		const endpoint = `/streams/tags${query}`;

		return this._get<APITagResponse>(endpoint);
	}

	/** Fetch videos by a user id, game id, or one or more video ids. Only one of these can be specified at a time. */
	async getVideos(options: GetVideosOptions): Promise<APIVideoResponse>{
		let query = "?";
		query += parseOptions(options);

		const endpoint = `/videos${query}`;
		return this._get<APIVideoResponse>(endpoint);
	}

	/** Returns a list of channels (users who have streamed within the past 6 months) that match the query via channel name or description either entirely or partially. Results include both live and offline channels. Online channels will have additional metadata (e.g. started_at, tag_ids). See sample response for distinction. */
	async searchChannels(options: SearchChannelsOptions): Promise<APIChannelResponse>{
		options.query = encodeURIComponent(options.query);
		const query = "?" + parseOptions(options);
		const endpoint = `/search/channels${query}`;

		return this._get<APIChannelResponse>(endpoint);
	}

	/** Returns a list of games or categories that match the query via name either entirely or partially. */
	async searchCategories(options: SearchCategoriesOptions): Promise<APIGameResponse>{
		options.query = encodeURIComponent(options.query);
		const query = "?" + parseOptions(options);
		const endpoint = `/search/categories${query}`;

		return this._get<APIGameResponse>(endpoint);
	}

	async getExtensionTransactions(options: GetExtensionTransactionsOptions): Promise<APIExtensionTransactionResponse>{
		const query = "?" + parseOptions(options);
		const endpoint = `/extensions/transactions${query}`;

		return this._get<APIExtensionTransactionResponse>(endpoint);
	}

	/*********************************
	Methods requiring user permissions
	**********************************/

	/** Gets the currently authenticated users profile information. */
	async getCurrentUser(): Promise<User | undefined>{
		if(this.isApp)
			this._error("Cannot get the current user when using an application token. Use access_token and refresh_token instead.");

		const endpoint = "/users";
		const result = await this._get<APIUserResponse>(endpoint);

		if(!result) {
			this._error("Failed to get current user.");
			return;
		}

		const user = result.data[0];
		return user;
	}

	/** Gets a ranked list of Bits leaderboard information for an authorized broadcaster. */
	async getBitsLeaderboard(options?: GetBitsLeaderboardOptions): Promise<APIBitsLeaderboardResponse>{
		if(!this._hasScope("bits:read"))
			this._error("missing scope `bits:read`");

		const query = options ? `?${parseOptions(options)}` : "";
		const endpoint = `/bits/leaderboard${query}`;

		return this._get<APIBitsLeaderboardResponse>(endpoint);
	}

	async getSubs(options: GetSubsOptions): Promise<APISubResponse>{
		if(!this._hasScope("channel:read:subscriptions"))
			this._error("missing scope `channel:read:subscriptions`");

		const query = `?${parseOptions(options)}`;
		const endpoint = `/subscriptions${query}`;

		return this._get<APISubResponse>(endpoint);
	}

	async getBannedUsers(options: GetBannedUsersOptions): Promise<APIBanResponse>{
		if(!this._hasScope("moderation:read"))
			this._error("missing scope `moderation:read`");

		const query = "?" + parseOptions(options);
		const endpoint = `/moderation/banned${query}`;

		return this._get<APIBanResponse>(endpoint);
	}
}
