/* eslint-disable camelcase */
import { CommercialLength } from "./objects";
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

interface BaseClipsOptions extends BaseOptions{
	/** Ending date/time for returned clips, in RFC3339 format. (Note that the seconds value is ignored.) If this is specified, `started_at` also must be specified; otherwise, the time period is ignored. */
	ended_at?: string;

	/** Starting date/time for returned clips, in RFC3339 format. (Note that the seconds value is ignored.) If this is specified, `ended_at` also should be specified; otherwise, the `ended_at` date/time will be 1 week after the `started_at` value. */
	started_at?: string;
}

export interface ClipsBroadcasterIdOptions extends BaseClipsOptions{
	/** ID of the broadcaster for whom clips are returned. The number of clips returned is determined by the `first` query-string parameter (default: 20). Results are ordered by view count. */
	broadcaster_id: string;
}

export interface ClipsGameIdOptions extends BaseClipsOptions{
	/** ID of the game for which clips are returned. The number of clips returned is determined by the `first` query-string parameter (default: 20). Results are ordered by view count. */
	game_id: string;
}

export interface ClipsIdOptions extends BaseClipsOptions{
	/** ID of the clip being queried. Limit: 100. */
	id: string | string[];
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

export interface GetChannelInfoOptions{
	/** ID of the channel to get */
	broadcaster_id: string;
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

export interface GetExtensionTransactionsOptions{
	/** ID of the extension to list transactions for. Maximum: 1 */
	extension_id: string;

	/** Transaction IDs to look up. Can include multiple to fetch multiple transactions in a single request.

		Maximum: 100 */
	id?: string | string[];

	/** The cursor used to fetch the next page of data. This only applies to queries without ID. If an ID is specified, it supersedes the cursor. */
	after?: string;

	/** Maximum number of objects to return.

	Maximum: 100
	Default: 20 */
	first?: string;
}

export interface GetCheermotesOptions{
	/** ID for the broadcaster who might own specialized Cheermotes. */
	broadcaster_id?: string;
}

export interface GetStreamKeyOptions{
	/** User ID of the broadcaster */
	broadcaster_id: string;
}

export interface GetStreamMarkerUserIdOptions extends BaseOptions{
	/** ID of the broadcaster from whose stream markers are returned. */
	user_id: string;
}

export interface GetStreamMarkerVideoIdOptions extends BaseOptions{
	/** ID of the VOD/video whose stream markers are returned. */
	video_id: string;
}

export interface CreateUserFollowsOptions{
	/** User ID of the follower */
	from_id: string;

	/** ID of the channel to be followed by the user */
	to_id: string;

	/** If `true`, the user gets email or push notifications (depending on the user’s notification settings) when the channel goes live. Default value is `false`. */
	allow_notifications?: boolean;
}

export interface DeleteUserFollowsOptions{
	/** User ID of the follower */
	from_id: string;

	/** Channel to be unfollowed by the user */
	to_id: string;
}

export interface GetUserActiveExtensionsOptions{
	/** ID of the user whose installed extensions will be returned. Limit: 1. */
	user_id?: string;
}

export interface ModifyChannelInformationOptions{
	/** ID of the channel to be updated */
	broadcaster_id: string;

	/** The current game ID being played on the channel */
	game_id?: string;

	/** The language of the channel */
	broadcaster_language?: string;

	/** The title of the stream */
	title?: string;
}

export interface GetCodeStatusOptions{
	/** The code to get the status of. Pass an array of codes to get the status of multiple codes.
	 *
	 * Max 20 codes allowed.
	*/
	code: string | string[];

	/** The user account which is going to receive the entitlement associated with the code. */
	user_id: string;
}

export interface ReplaceStreamTagsOptions{
	/** IDs of tags to be applied to the stream.

		Maximum of 100 supported.
	*/
	tag_ids?: string[];

	/** ID of the stream for which tags are to be replaced. */
	broadcaster_id: string;
}

export interface UpdateUserOptions{
	/** User’s account description */
	description?: string;
}

export interface CreateClipOptions{
	/** ID of the stream from which the clip will be made. */
	broadcaster_id: string;

	/** If `false`, the clip is captured from the live stream when the API is called; otherwise, a delay is added before the clip is captured (to account for the brief delay between the broadcaster’s stream and the viewer’s experience of that stream). Default: `false`. */
	has_delay?: boolean;
}

export interface StartCommercialOptions{
	/** ID of the channel requesting a commercial */
	broadcaster_id: string;

	/** Desired length of the commercial in seconds.
	 *
	 * Valid options are 30, 60, 90, 120, 150, 180
	*/
	length: CommercialLength;
}

export interface GetModeratorsOptions{
	/** Provided `broadcaster_id` must match the `user_id` in the auth token.

		Maximum: 1 */
	broadcaster_id: string;

	/** Filters the results and only returns a status object for users who are banned in this channel and have a matching user_id.

	Maximum: 100 */
	user_id?: string | string[];

	/** Cursor for forward pagination: tells the server where to start fetching the next set of results in a multi-page response. This applies only to queries without `user_id`. If a `user_id` is specified, it supersedes any cursor/offset combinations. The cursor value specified here is from the `pagination` response field of a prior query. */
	after?: string;
}

export interface BaseOptions{
	/** Maximum number of objects to return. Maximum: 100. Default: 20. */
	first?: number;

	/** Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. */
	after?: string;

	/** Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.  */
	before?: string;
}
