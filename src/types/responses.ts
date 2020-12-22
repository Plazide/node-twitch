/* eslint-disable camelcase */
import {
	Game,
	User,
	Follow,
	Stream,
	Tag,
	Video,
	BitsPosition,
	DateRange,
	Sub,
	Channel,
	Ban,
	ExtensionTransaction,
	Cheermote,
	StreamKey,
	ChannelInfo,
	Clip,
	StreamMarker,
	Extension,
	ActiveExtension,
	CreatedClip,
	Moderator, CodeStatus, Commercial
} from "./objects";

export interface APIBaseResponse{
	total?: number;
	pagination?: {
		cursor: string;
	}
}

/** Response from the Twitch API */
export interface APIGenericResponse extends APIBaseResponse{
	data: Game[] | User[];
}

export interface APIGameResponse extends APIBaseResponse{
	data: Game[];
}

export interface APIUserResponse extends APIBaseResponse{
	data: User[];
}

export interface APIChannelResponse extends APIBaseResponse{
	data: Channel[];
}

export interface APIChanneInfoResponse{
	data: ChannelInfo[];
}

export interface APIFollowResponse extends APIBaseResponse{
	data: Follow[];
}

export interface APIStreamResponse extends APIBaseResponse{
	data: Stream[];
}

export interface APIStreamMarkerResponse extends APIBaseResponse{
	data: StreamMarker[];
}

export interface APIStreamKeyResponse{
	data: StreamKey[];
}

export interface APIVideoResponse extends APIBaseResponse{
	data: Video[];
}

export interface APIClipsResponse extends APIBaseResponse{
	data: Clip[];
}

export interface APITagResponse extends APIBaseResponse{
	data: Tag[];
}

export interface APISubResponse extends APIBaseResponse{
	data: Sub[];
}

export interface APIBanResponse extends APIBaseResponse{
	data: Ban[];
}

export interface APIExtensionTransactionResponse extends APIBaseResponse{
	data: ExtensionTransaction[];
}

export interface APIExtensionResponse{
	data: Extension[];
}

export interface APIActiveUserExtensionResponse{
	data: ActiveExtension[];
}

export interface APICheermoteResponse{
	data: Cheermote[];
}

export interface APICreateClipResponse{
	data: CreatedClip[];
}

export interface APIModeratorResponse extends APIBaseResponse{
	data: Moderator[];
}

export interface APICodeStatusResponse{
	data: CodeStatus[];
}

export interface APIBitsLeaderboardResponse{
	data: BitsPosition[];

	/** Date range of the results. */
	date_range: DateRange;

	/** Total number of results (users) returned. This is `count` or the total number of entries in the leaderboard, whichever is less. */
	total: number;
}

export interface APICommercialResponse{
	data: Commercial[];
}
