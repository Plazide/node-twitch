/* eslint-disable camelcase */
export interface User{
	/** User's broadcaster type: "partner", "affiliate", or "". */
	broadcaster_type: string;

	/** User's channel description. */
	description: string;

	/** User's display_name. */
	display_name: string;

	/** User's email address. Is only included if scope user:read:email was included in the authentication scopes. */
	email: string;

	/** User's ID. */
	id: string;

	/** User's login name. */
	login: string;

	/** URL of the user's offline image. */
	offline_image_url: string;

	/** URL of the user's profile image. */
	profile_image_url: string;

	/** User's type: "staff", "admin", "global_mod", or "". */
	type: string;

	/** Total number of views of the user's channel. Does not update overtime. */
	view_count: number;
}

export interface Channel{
	/** ID of the game being played on the stream */
	game_id: string;

	/** Channel ID */
	id: string;

	/** Display name corresponding to `user_id`  */
	display_name: string;

	/** Channel language (Broadcaster Language field from the Channels service) */
	broadcaster_language: string;

	/** Channel title */
	title: string;

	/** Thumbnail URL of the stream. All image URLs have variable width and height. You can replace {width} and {height} with any values to get that size image.  */
	thumbnail_url: string;

	/** Live status */
	is_live: boolean;

	/** UTC timestamp. (live only) */
	started_at: string;

	/** Shows tag IDs that apply to the stream (live only).See https://www.twitch.tv/directory/all/tags for tag types

	Note: Category Tags are not returned */
	tag_ids: string;
}

export interface Game{
	/** Template URL for the game’s box art. */
	box_art_url: string;

	/** Game ID. */
	id: string;

	/** Game name. */
	name: string;
}

export interface Follow{
	/** Date and time when the `from_id` user followed the `to_id` user. */
	followed_at: string;

	/** ID of the user following the `to_id` user. */
	from_id: string;

	/** Display name corresponding to `from_id`. */
	from_name: string;

	/**	ID of the user being followed by the `from_id` user. */
	to_id: string;

	/** Display name corresponding to `to_id`. */
	to_name: string;
}

export interface Stream{
	/** ID of the game being played on the stream. */
	game_id: string;

	/** Stream ID. */
	id: string;

	/** Stream language. */
	language: string;

	/** UTC timestamp. */
	started_at: string;

	/** Shows tag IDs that apply to the stream. */
	tag_ids: string;

	/** Thumbnail URL of the stream. All image URLs have variable width and height. You can replace `{width}` and `{height}` with any values to get that size image */
	thumbnail_url: string;

	/** Stream title. */
	title: string;

	/** Stream type: `"live"` or `""` (in case of error). */
	type: string;

	/** ID of the user who is streaming. */
	user_id: string;

	/** Display name corresponding to `user_id`. */
	user_name: string;

	/** Number of viewers watching the stream at the time of the query. */
	viewer_count: number;
}

export interface Video{
	/** Date when the video was created. */
	created_at: string;

	/** Description of the video. */
	description: string;

	/** Length of the video. */
	duration: string;

	/** ID of the video. */
	id: string;

	/** Language of the video. */
	language: string;

	/** Date when the video was published. */
	published_at: string;

	/** Template URL for the thumbnail of the video. */
	thumbnail_url: string;

	/** Title of the video. */
	title: string;

	/** Type of video. Valid values: "upload", "archive", "highlight". */
	type: "upload" | "archive" | "highlight";

	/** URL of the video. */
	url: string;

	/** ID of the user who owns the video. */
	user_id: string;

	/** Number of times the video has been viewed. */
	view_count: number;

	/** Indicates whether the video is publicly viewable. Valid values: "public", "private". */
	viewable: "public" | "private";
}

export interface Clip{
	/** User ID of the stream from which the clip was created. */
	broadcaster_id: string;

	/** Display name corresponding to `broadcaster_id`. */
	broadcaster_name: string;

	/** Date when the clip was created. */
	created_at: string;

	/** ID of the user who created the clip. */
	creator_id: string;

	/** Display name corresponding to `creator_id`. */
	creator_name: string;

	/** URL to embed the clip. */
	embed_url: string;

	/** ID of the game assigned to the stream when the clip was created. */
	game_id: string;

	/** ID of the clip being queried. */
	id: string;

	/** Language of the stream from which the clip was created. */
	language: string;

	/** URL of the clip thumbnail. */
	thumbnail_url: string;

	/** Title of the clip. */
	title: string;

	/** URL where the clip can be viewed. */
	url: string;

	/** ID of the video from which the clip was created. */
	video_id: string;

	/** Number of times the clip has been viewed. */
	view_count: number;
}

export interface Tag{
	/** ID of the tag. */
	tag_id: string;

	/** true if the tag is auto-generated; otherwise, false . An auto-generated tag is one automatically applied by Twitch (e.g., a language tag based on the broadcaster’s settings); these cannot be added or removed by the user. */
	is_auto: boolean;

	/** All localized names of the tag. */
	localization_names: Record<string, string>;

	/** All localized descriptions of the tag. */
	localization_descriptions: Record<string, string>;
}

export interface Sub{
	/** User ID of the broadcaster.  */
	broadcaster_id: string;

	/** Display name of the broadcaster. */
	broadcaster_name: string;

	/** Determines if the subscription is a gift subscription. */
	is_gift: boolean;

	/** Type of subscription (Tier 1, Tier 2, Tier 3).
		1000 = Tier 1, 2000 = Tier 2, 3000 = Tier 3 subscriptions.  */
	tier: "1000" | "2000" | "3000";

	/** Name of the subscription. */
	plan_name: string;

	/** ID of the subscribed user. */
	user_id: string;

	/** Display name of the subscribed user. */
	user_name: string;
}

export interface BitsPosition{
	/** ID of the user (viewer) in the leaderboard entry. */
	user_id: string;

	/** Display name corresponding to `user_id`. */
	user_name: string;

	/** Leaderboard rank of the user. */
	rank: number;

	/** Leaderboard score (number of Bits) of the user. */
	score: number;
}

export interface DateRange{
	/** Start of the date range for the returned data. */
	started_at: string;

	/**  End of the date range for the returned data. */
	ended_at: string;
}
