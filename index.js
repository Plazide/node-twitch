/* eslint-disable camelcase */
const request = require("request-promise-native");
const{ EventEmitter } = require("events");
const methods = require("./methods");

/**
 * Api response callback.
 * @callback apiCallback
 * @param {Object} body - A json parsed object containing the body of the response.
 * @param {Object} response - The entire response object from the request.
 * @memberof TwitchApi
 */

/**
  * @typedef {Object} apiError
  * @property {string} type - The type of error, eg. "http"
  * @property {number} code - The status code of the http request.
  * @property {string} statusMessage - Short message explaining the error.
  * @property {string} message - Long message explaining the error.
  * @memberof TwitchApi
  */

/**
 * Class to control access to the Twitch api.
 * @fires TwitchApi#ready - Fired when the api is ready to use.
 * @fires TwitchApi#refresh - Fired when access token is refreshed.
 * @fires TwitchApi#error - Fired when something goes wrong.
 * @property {Object} user - Object containing information about the currently authenticated user.
 * @property {string} user.broadcaster_type - User's broadcaster type: "partner", "affiliate", or "".
 * @property {string} user.description - User's channel description.
 * @property {string} user.display_name - User's display_name.
 * @property {string} user.email - User's email address. Is only included if scope user:read:email was included in the authentication scopes.
 * @property {string} user.id - User's ID.
 * @property {string} user.login - User's login name.
 * @property {string} user.offline_image_url - URL of the user's offline image.
 * @property {string} user.profile_image_url - URL of the user's profile image.
 * @property {string} user.type - User's type: "staff", "admin", "global_mod", or "".
 * @property {number} user.view_count - Total number of views of the user's channel. Does not update overtime.
 */
class TwitchApi extends EventEmitter{
	/**
	 * Initialize the api.
	 * @param {Object} config - A configuration object containing your client_id and client_secret, as well as an access_token and refresh_token.
	 * @param {string} config.client_id - Your client id.
	 * @param {string} config.client_secret - Your client secret.
	 * @param {string[]} [config.scopes] - The scopes that your application requires. Only needed when using a user access token.
	 * @param {string} [config.access_token] - The access token from an authenticated user.
	 * @param {string} [config.refresh_token] - The refresh token from an authenticated user.
	 * @param {bool} [config.isApp] - A boolean value that determines whether or not the api should fetch an app access token. When using this option, you are only able to access public user information.
	 */
	constructor(config){
		super();
		const{ isApp, access_token, refresh_token, client_id, client_secret, scopes } = config;
		this.isApp = isApp || false;
		this.access_token = access_token;
		this.refresh_token = refresh_token;
		this.client_id = client_id || methods.getLocalClientId();
		this.client_secret = client_secret || methods.getLocalClientSecret();
		this.base = "https://api.twitch.tv/helix";
		this.refresh_attempts = 0;
		this.scopes = scopes;

		if(this.isApp && this.access_token)
			this._error("Option isApp is set to true while an access_token is provided. Choose one method of authentication, do not use both.");

		if(this.isApp){
			this._getAppAccessToken( result => {
				this.access_token = result.access_token;

				this.emit("ready");
			});
		}else{
			this.getCurrentUser( body => {
				const data = body.data[0];

				// Add user object to class instance.
				this.user = data;

				/**
				 * Event fired when the api is ready to use.
				 * @event TwitchApi#ready
				 */
				this.emit("ready");
			});

			methods.setApiUser(config);
		}
	}

	/*
	****************
	PRIVATE METHODS
	****************
	*/

	/**
	 * Throw a new error.
	 * @param {string} err - The error message.
	 * @private
	 */
	_error(err){
		throw new Error(err);
	}

	/**
	 * Checks if a event is handled or not.
	 * @param {string} event - Name of the event to check.
	 * @private
	 */
	_isListeningFor(event){
		return this.eventNames().indexOf(event) !== -1;
	}

	/**
	 * Gets a app access token from the twitch api using the provided client id and client secret.
	 * @param {apiCallback} [callback]
	 * @private
	 */
	async _getAppAccessToken(callback){
		const data = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "client_credentials",
			scope: this.scopes.join(" ")
		};
		const options = {
			url: "https://id.twitch.tv/oauth2/token",
			method: "POST",
			json: true,
			body: data,
			headers: {
				"Content-Type": "application/json"
			},
			// Get the response object and not just the body.
			resolveWithFullResponse: true,
			simple: false
		};

		const response = await request(options).catch(err => { this._error(err); });
		const body = response.body;

		if(callback)
			callback(body, response);
		else
			return body;
	}

	/**
	 * Refresh the access token using the refresh token the class was initialized with.
	 * @param {apiCallback} [callback] - The callback function.
	 * @private
	 */
	async _refresh(callback){
		if(this.refresh_attempts > 1)
			this._error("Refresh attempts have failed. Use the previously logged information as help.");

		const data = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "refresh_token",
			refresh_token: encodeURIComponent(this.refresh_token)
		};
		const options = {
			url: "https://id.twitch.tv/oauth2/token",
			method: "POST",
			json: true,
			body: data,
			headers: {
				"Content-Type": "application/json"
			},
			// Get the response object and not just the body.
			resolveWithFullResponse: true,
			simple: false
		};

		const valid = await this._validate();
		if(valid)
			return;

		if(this.isApp){
			const result = await this._getAppAccessToken().catch( err => { this._error(err); });
			this.access_token = result.access_token;

			this.emit("refresh", result);

			if(callback)
				callback();

			return;
		}

		const response = await request(options).catch( err => { this._error(err); });
		const body = response.body;

		const access_token = body.access_token;
		const refresh_token = body.refresh_token;

		if(access_token)
			this.access_token = access_token;

		if(refresh_token)
			this.refresh_token = refresh_token;

		if(this._isListeningFor("refresh"))
			/**
			 * Refresh event fired when the access token is refreshed. Listening to this event lets you access new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically.
			 * @event TwitchApi#refresh
			 * @type {Object}
			 * @property {string} access_token - The new access token.
			 * @property {string} refresh_token - The new refresh token. Is not always included.
			 * @property {number} expires_in - The amount of time in seconds until the access token expires.
			 * @property {string|string[]} scope - The scopes associated with the access token.
			 */
			this.emit("refresh", body);

		if(callback)
			callback();

		this.refresh_attempts += 1;
	}

	/**
	 * Check validity of access token.
	 * @param {apiCallback} [callback] - The callback function.
	 * @private
	 */
	async _validate(callback){
		const options = {
			url: "https://id.twitch.tv/oauth2/validate",
			headers: {
				"Authorization": "OAuth " + this.access_token
			},
			// Get the response object and not just the body.
			resolveWithFullResponse: true,
			simple: false
		};

		const response = await request(options).catch(err => { this._error(err); });
		const body = JSON.parse(response.body);

		const message = body.message;
		let valid = false;

		switch(response.statusCode){
		case 200:
			valid = true;
			break;
		case 401:
			valid = false;
			break;
		}

		if(message === "missing authorization token")
			this._error(message);

		if(callback)
			callback(valid);
		else
			return valid;
	}

	/**
	 * Send a GET request to the specified api endpoint.
	 * @param {string} endpoint - The endpoint to get.
	 * @param {apiCallback} [callback] - The callback function containing results.
	 * @private
	 */
	async _get(endpoint, callback){
		const options = {
			url: this.base + endpoint,
			method: "GET",
			headers: {
				"Client-ID": this.client_id,
				"Authorization": "Bearer " + this.access_token
			},
			// Get the response object and not just the body.
			resolveWithFullResponse: true,
			simple: false
		};

		const response = await request(options).catch(err => { this._error(err); });
		const body = JSON.parse(response.body);

		const status = response.statusCode;
		const message = body.message;
		const regexp = new RegExp(/\bValid OAuth token with/i);

		if(status >= 400){
			const err_msg = new Error(`\nGet request to ${options.url} failed:\n` +
			`${status} ${response.statusMessage}: ${message}\n`);
			const err_obj = {
				type: "http",
				code: status,
				statusMessage: response.statusMessage,
				message: message
			};

			if(regexp.test(message))
				this._error(message);

			console.error(err_msg);

			if(this._isListeningFor("error"))
				/**
				 * Error event emitted when something fails in the api.
				 * @event TwitchApi#error
				 * @type {apiError}
				 */
				this.emit("error", err_obj);
		}

		// If some error occurred, try to refresh the access token.
		if(status >= 400){
			await this._refresh();
			return this._get(endpoint, callback);
		}

		if(callback)
			callback(body, response);
		else
			return body;
	}

	/**
	 * Send a POST request to the specified api endpoint.
	 * @param {string} endpoint - The endpoint to call.
	 * @param {Object} data - The json object of data to post.
	 * @param {apiCallback} [callback] - The callback function.
	 * @private
	 */
	async _post(endpoint, data, callback){
		const options = {
			url: this.base + endpoint,
			method: "POST",
			json: true,
			body: data,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + this.access_token,
				"Client-ID": this.client_id
			},
			// Get the response object and not just the body.
			resolveWithFullResponse: true,
			simple: false
		};

		const response = await request(options).catch( err => { this._error(err); });
		const body = JSON.parse(response.body);

		const status = response.statusCode;
		const message = JSON.parse(body).message;

		if(status >= 400){
			const err_msg = `\nPost request to ${options.url} failed:\n` +
			`${status} ${response.statusMessage}: ${message}\n`;
			const err_obj = {
				type: "http",
				code: status,
				statusMessage: response.statusMessage,
				message: message
			};

			console.error(err_msg);

			this.emit("error", err_obj);
		}

		if(status === 401){
			this.refresh_token(() => {
				this._post(endpoint, callback);
			});

			return;
		}

		if(callback)
			callback(body, response);
		else
			return body;
	}
}

// Public methods
TwitchApi.prototype.getUsers = require("./lib/getUsers");
TwitchApi.prototype.getBitsleaderboard = require("./lib/getBitsleaderboard");
TwitchApi.prototype.getCurrentUser = require("./lib/getCurrentUser");
TwitchApi.prototype.getFollows = require("./lib/getFollows");
TwitchApi.prototype.getUsersSubStatus = require("./lib/getUsersSubStatus");
TwitchApi.prototype.getSubsById = require("./lib/getSubsById");
TwitchApi.prototype.getStreams = require("./lib/getStreams");
TwitchApi.prototype.customRequest = require("./lib/customRequest");
TwitchApi.prototype.getGames = require("./lib/getGames");
TwitchApi.prototype.getTopGames = require("./lib/getTopGames");
TwitchApi.prototype.getVideos = require("./lib/getVideos");

module.exports = TwitchApi;

process.on("unhandledRejection", (err) => {
	console.error(err);
	process.exit(1);
});
