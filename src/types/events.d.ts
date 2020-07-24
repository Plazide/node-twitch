/* eslint-disable camelcase */

/** Refresh event fired when the access token is refreshed. Listening to this event lets you access new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically. */
export interface AuthEvent{
	/** The new access token. */
	access_token: string;

	/** The new refresh token. Is not always included. */
	refresh_token?: string;

	/** The amount of time in seconds until the access token expires. */
	expires_in: number;

	/** The scopes associated with the access token. */
	scope: string | string[];

	token_type?: string;
}
