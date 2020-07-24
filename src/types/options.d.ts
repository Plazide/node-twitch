/* eslint-disable camelcase */
import { Scope } from "./scopes";

/** The configuration options for the API instance. */
export interface TwitchApiConfig{
	/** Your client id. */
	client_id: string;

	/** Your client secret. */
	client_secret: string;

	/** The scopes that your application requires. Only needed when using an `access_token` from a user. */
	scopes?: Scope[];

	/** An `access_token` from an authenticated user. */
	access_token?: string;

	/** A refresh token from authenticated user. */
	refresh_token?: string;

	/** Your registered redirect URI. */
	redirect_uri?: string;

	/** Deprecated: A boolean value that determines whether or not the api should fetch an app access token. When using this option, you are only able to access public user information. If no `access_token` is provided, an app access token will be automatically acquired. */
	isApp?: boolean;
}

/** The options to customize the request. */
export interface GetFollowsOptions{
	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	after?: string;

	/** Maximum number of objects to return. Maximum: 100. Default: 20. */
	first?: number;

	/** User ID. Return list of channels that the supplied user is following. */
	from_id?: string | number;

	/** User ID. Return list of users who are following the supplied channel. */
	to_id?: string | number;
}

/** An options object used to create the request. */
export interface GetStreamsOptions extends BaseOptions{
	/** Returns streams broadcasting a specified game ID. You can specify up to 100 IDs. */
	game_id?: string[] | string | number[] | number;

	/** Stream language. You can specify up to 100 languages. */
	language?: string[] | string;

	/** An array of `user_id`s and/or `user_login`s. This is not a native Twitch API parameter. */
	channels?: string[];

	/** A single `user_id` or `user_login`. This is not a native Twitch API parameter. */
	channel?: string;
}

/** Options for getting videos. At least one of `id`, `user_id`, and `game_id` needs to be specified. */
export interface GetVideosOptions extends BaseOptions{
	/** Single video ID or array of video IDs. Limit: 100. If this is specified, you cannot use any of the optional query parameters. */
	id?: string[] | string;

	/** ID of the user who owns the video. Limit 1. */
	user_id?: string;

	/** ID of the game the video is of. Limit 1. */
	game_id?: string;

	/** Language of the video being queried. Limit: 1. */
	language?: string;

	/** Period during which the video was created. Valid values: `"all"`, `"day"`, `"week"`, `"month"`. Default: `"all"`. */
	period?: "all" | "day" | "week" | "month";

	/** Sort order of the videos. Valid values: `"time"`, `"trending"`, `"views"`. Default: `"time"`. */
	sort?: "time" | "trending" | "views";

	/** Type of video. Valid values: `"all"`, `"upload"`, `"archive"`, `"highlight"`. Default: `"all"`. */
	type?: "all" | "upload" | "archive" | "highlight";
}

/** Options for getting all stream tags */
export interface GetAllStreamTagsOptions{
	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	after?: string;

	/** Maximum number of objects to return. Maximum: 100. Default: 20. */
	first?: number;

	/** ID of a tag. Multiple IDs can be specified, separated by ampersands. If provided, only the specified tag(s) is(are) returned.

	Maximum of 100. */
	tag_id?: string | string[];
}

export interface GetStreamTagsOptions{
	/** ID of the stream thats tags are going to be fetched */
	broadcaster_id: string;
}

export interface GetBitsLeaderboardOptions{
	/** Number of results to be returned. Maximum: 100. Default: 10. */
	count?: number;

	/** Time period over which data is aggregated (PST time zone). This parameter interacts with `started_at`. Valid values are given below. Default: "all".

	- `"day"` – 00:00:00 on the day specified in `started_at`, through 00:00:00 on the following day.
    - `"week"` – 00:00:00 on Monday of the week specified in `started_at`, through 00:00:00 on the following Monday.
    - `"month"` – 00:00:00 on the first day of the month specified in `started_at`, through 00:00:00 on the first day of the following month.
    - `"year"` – 00:00:00 on the first day of the year specified in `started_at`, through 00:00:00 on the first day of the following year.
    - `"all"` – The lifetime of the broadcaster's channel. If this is specified (or used by default), `started_at` is ignored. */
	period?: "day" | "week" | "month" | "year" | "all";

	/** Timestamp for the period over which the returned data is aggregated. Must be in RFC 3339 format. If this is not provided, data is aggregated over the current period; e.g., the current day/week/month/year. This value is ignored if `period` is `"all"`.

	Any `+` operator should be URL encoded.

	Currently, the HH:MM:SS part of this value is used only to identify a given day in PST and otherwise ignored. For example, if the `started_at` value resolves to 5PM PST yesterday and `period` is `"day"`, data is returned for all of yesterday. */
	started_at?: string;

	/** ID of the user whose results are returned; i.e., the person who paid for the Bits.

	As long as `count` is greater than 1, the returned data includes additional users, with Bits amounts above and below the user specified by `user_id`.

	If `user_id` is not provided, the endpoint returns the Bits leaderboard data across top users (subject to the value of `count`). */
	user_id?: string;
}

export interface GetSubsOptions{
	/** User ID of the broadcaster. Must match the User ID in the Bearer token. */
	broadcaster_id: string;

	/** Returns broadcaster’s subscribers.

		Unique identifier of account to get subscription status of. Accepts up to 100 values. */
	user_id?: string[] | string;
}

export interface SearchChannelsOptions extends SearchOptions{
	/** Filter results for live streams only. Default: false */
	live_only?: boolean;
}

export type SearchCategoriesOptions = SearchOptions;

export interface SearchOptions{
	/** The query used to find categories. Do not URI encode, `node-twitch-api` does this for you. */
	query: string;

	/** Maximum number of objects to return.

	Maximum: 100.

	Default: 20. */
	first?: number;

	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the `pagination` response field of a prior query. */
	after?: string;
}

export interface GetBannedUsersOptions{
	/** Provided broadcaster_id must match the user_id in the auth token.

	Maximum: 1 */
	broadcaster_id: string;

	/** Filters the results and only returns a status object for users who are banned in this channel and have a matching user_id.

	Maximum: 100 */
	user_id?: string | string[];

	/** Cursor for forward pagination: tells the server where to start fetching the next set of results in a multi-page response. This applies only to queries without `user_id`. If a `user_id` is specified, it supersedes any cursor/offset combinations. The cursor value specified here is from the `pagination` response field of a prior query. */
	after?: string;

	/** Cursor for backward pagination: tells the server where to start fetching the next set of results in a multi-page response. This applies only to queries without `user_id`. If a `user_id` is specified, it supersedes any cursor/offset. combinations. The cursor value specified here is from the `pagination` response field of a prior query. */
	before?: string;
}

export interface BaseOptions{
	/** Maximum number of objects to return. Maximum: 100. Default: 20. */
	first?: number;

	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	after?: string;

	/** Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.  */
	before?: string;
}
