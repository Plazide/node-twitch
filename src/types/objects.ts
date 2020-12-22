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

export interface ChannelInfo{
	/** Twitch User ID of this channel owner */
	broadcaster_id: string;

	/** Display name of this channel owner */
	broadcaster_name: string;

	/** Name of the game being played on the channel */
	game_name: string;

	/** Current game ID being played on the channel */
	game_id: string;

	/** Language of the channel */
	broadcaster_language: string;

	/** Title of the stream */
	title: string;
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
	tag_ids: string[];

	/** Thumbnail URL of the stream. All image URLs have variable width and height. You can replace `{width}` and `{height}` with any values to get that size image */
	thumbnail_url: string;

	/** Replace the `{width}` and `{height}` values in the thumbnail url by passing in options. Returns a working thumbnail url. If no options are provided, the default dimensions are `1920x1080` */
	getThumbnailUrl: (options?: { width: number, height: number }) => string;

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

export interface StreamMarker{
	/** ID of the marker. */
	id: string;

	/** RFC3339 timestamp of the marker. */
	created_at: string;

	/** Description of the marker. */
	description: string;

	/** Relative offset (in seconds) of the marker, from the beginning of the stream. */
	position_seconds: number;

	/** A link to the stream with a query parameter that is a timestamp of the marker’s location. */
	URL: string;

	/** ID of the user whose markers are returned. */
	user_id: string;

	/** Display name corresponding to `user_id`. */
	user_name: string;

	/** ID of the stream (VOD/video) that was marked. */
	video_id: string;
}

export interface StreamKey{
	/** Stream key for the channel */
	stream_key: string;
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

export interface Ban{
	/** User ID of a user who has been banned. */
	user_id: string;

	/** Display name of a user who has been banned. */
	user_name: string;

	/** RFC3339 formatted timestamp for timeouts; empty string for bans. */
	expires_at: string;
}

export interface Moderator{
	/** `user_id` of moderator */
	user_id: string;

	/** `user_name` of moderator */
	user_name: string;
}

declare enum Status{
	/** Request successfully redeemed this code to the authenticated user’s account.This status will only ever be encountered when calling the POST API to redeem a key. */
	SUCCESSFULLY_REDEEMED,

	/** Code has already been claimed by a Twitch user. */
	ALREADY_CLAIMED,

	/** Code has expired and can no longer be claimed. */
	EXPIRED,

	/** User is not eligible to redeem this code. */
	USER_NOT_ELIGIBLE,

	/** Code is not valid and/or does not exist in our database. */
	NOT_FOUND,

	/** Code is not currently active. */
	INACTIVE,

	/** Code has not been claimed.This status will only ever be encountered when calling the GET API to get a keys status. */
	UNUSED,

	/** Code was not properly formatted. */
	INCORRECT_FORMAT,

	/** Indicates some internal and/or unknown failure handling this code. */
	INTERNAL_ERROR
}

export interface CodeStatus{
	/** The code. */
	code: string;

	/**  */
	status: Status;
}

export interface CreatedClip{
	/** ID of the clip that was created. */
	id: string;

	/** URL of the edit page for the clip. */
	edit_url: string;
}

export interface ExtensionTransaction{
	/** Unique identifier of the Bits in Extensions Transaction. */
	id: string;

	/** UTC timestamp when this transaction occurred. */
	timestamp: string;

	/** Twitch User ID of the channel the transaction occurred on. */
	broadcaster_id: string;

	/** Twitch Display Name of the broadcaster. */
	broadcaster_name: string;

	/** Twitch User ID of the user who generated the transaction. */
	user_id: string;

	/** Twitch Display Name of the user who generated the transaction. */
	user_name: string;

	/** Enum of the product type. Currently only `BITS_IN_EXTENSION`. */
	product_type: "BITS_IN_EXTENSION";

	/** Object representing the product acquired, as it looked at the time of the transaction. */
	product_data: {
		/** Set this field to twitch.ext + your extension ID. */
		domain?: string;

		/** Flag that denotes whether or not the data was sent over the extension pubsub to all instances of the extension. */
		broadcast?: boolean;

		/** Always empty since only unexpired products can be purchased. */
		expiration?: string;

		/** Unique identifier for the product across the extension. */
		sku: string;

		/** Object representing the cost to acquire the product */
		cost: {
			/** Number of Bits required to acquire the product. */
			amount: number;

			/** Always the string “Bits”. */
			type: "Bits";
		}

		/** Display Name of the product. */
		displayName: string;

		/** Flag used to indicate if the product is in development. Either `true` or `false`. */
		inDevelopment: boolean;
	}
}

export interface Extension{
	/** Indicates whether the extension is configured such that it can be activated. */
	can_activate: boolean;

	/** Types for which the extension can be activated. Valid values: `"component"`, `"mobile"`, `"panel"`, `"overlay"`. */
	type: string[];

	/** ID of the extension. */
	id: string;

	/** Name of the extension. */
	name: string;

	/** Version of the extension. */
	version: string;
}

export interface ActiveExtension{
	panel: Map<string, ActiveExtensionBase | NotActive>;
	overlay: Map<string, ActiveExtensionBase | NotActive>;
	component: Map<string, ExtensionComponent | NotActive>;
}

interface NotActive{
	/** Activation state of the extension, for each extension type (component, overlay, mobile, panel). If false, no other data is provided. */
	active: false;
}

interface ExtensionComponent extends ActiveExtensionBase{
	/** (Video-component Extensions only) X-coordinate of the placement of the extension. */
	x: number;

	/** (Video-component Extensions only) Y-coordinate of the placement of the extension. */
	y: number;
}

interface ActiveExtensionBase{
	/** Activation state of the extension, for each extension type (component, overlay, mobile, panel). If false, no other data is provided. */
	active: boolean;

	/** ID of the extension. */
	id: string;

	/** Version of the extension. */
	version: string;

	/** Name of the extension. */
	name: string;
}

export interface Cheermote{
	/** An array of Cheermotes with their metadata.  */
	tiers: CheermoteTier[]

	/** Shows whether the emote is `global_first_party`,  `global_third_party`, `channel_custom`, `display_only`, or `sponsored`. */
	type: "global_first_party" | "global_third_party" | "channel_custom" | "display_only" | "sponsored";

	/** Order of the emotes as shown in the bits card, in ascending order. */
	order: number;

	/** The date when this Cheermote was last updated. */
	last_updated: string;

	/** Indicates whether or not this emote provides a charity contribution match during charity campaigns. */
	is_charitable: boolean;
}

export interface CheermoteTier{
	/** Minimum number of bits needed to be used to hit the given tier of emote.   */
	min_bits: number;

	/** ID of the emote tier. Possible tiers are: 1,100,500,1000,5000, 10k, or 100k. */
	id: "1" | "100" | "500" | "1000" | "5000" | "10k" | "100k";

	/** Hex code for the color associated with the bits of that tier. Grey, Purple, Teal, Blue, or Red color to match the base bit type. */
	color: string;

	/** Structure containing both animated and static image sets, sorted by light and dark. */
	images: {
		dark: CheermoteImages;
		light: CheermoteImages;
	};

	/** Indicates whether or not emote information is accessible to users. */
	can_sheer: boolean;

	/** Indicates whether or not we hide the emote from the bits card. */
	show_in_bits_card: boolean;
}

interface CheermoteImages{
	animated: {
		"1": string;
		"2": string;
		"3": string;
		"4": string;
		"1.5": string;
	}
	static: {
		"1": string;
		"2": string;
		"3": string;
		"4": string;
		"1.5": string;
	}
}

export interface DateRange{
	/** Start of the date range for the returned data. */
	started_at: string;

	/**  End of the date range for the returned data. */
	ended_at: string;
}

export interface Commercial{
	/** Length of the triggered commercial */
	length: CommercialLength;

	/** Provides contextual information on why the request failed */
	message: string;

	/** Seconds until the next commercial can be served on this channel */
	retry_after: number;
}

export type CommercialLength = 30 | 60 | 90 | 120 | 150 | 180;
