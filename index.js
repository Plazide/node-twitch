const request = require("request");
const { EventEmitter } = require("events");
const methods = require("./methods");

/**
 * Class to control access to the Twitch api.
 * @fires TwitchApi#refresh - Fired when access token is refreshed.
 * @fires TwitchApi#error - Fired when something goes wrong.
 */
class TwitchApi extends EventEmitter{
	/**
	 * Initialize the api.
	 * @param {object} config - A configuration object containing your client_id and client_secret, as well as an access_token and refresh_token.
	 */
	constructor(config){
		super();
		this.access_token = config.access_token;
		this.refresh_token = config.refresh_token;
		this.client_id = config.client_id || methods.getLocalClientId();
		this.client_secret = config.client_secret || methods.getLocalClientSecret();
		this.base = "https://api.twitch.tv/helix";

		this.getCurrentUser( body => {
			const data = body.data[0];

			// Add user object to class instance.
			this.user = data;
		});

		methods.setApiUser(config);
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
	 * Refresh the access token using the refresh token the class was initialized with.
	 * @param {function} callback - The callback function.
	 * @private
	 */
	_refresh(callback){
		const data = {
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "refresh_token",
			refresh_token: encodeURIComponent(this.refresh_token)
		}
		const options = {
			url: "https://id.twitch.tv/oauth2/token",
			method: "POST",
			json: true,
			body: data,
			headers: {
				"Content-Type": "application/json"
			}
		}

		this._validate( (valid) => {
			if(valid)
				return;

			request(options, (err, response, body) => {
				if(err) this._error(err);

				const access_token = body.access_token;
				const refresh_token = body.refresh_token;

				if(access_token)
					this.access_token = access_token;

				if(refresh_token)
					this.refresh_token = refresh_token;

				/**
				 * Refresh event fired when the access token is refreshed. Listening to this event lets you access new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically.
				 * @event TwitchApi#refresh
				 * @type {object}
				 * @property {string} access_token - The new access token.
				 * @property {string} refresh_token - The new refresh token. Is not always included.
				 * @property {number} expires_in - The amount of time in seconds until the access token expires.
				 * @property {array | string} scope - The scopes associated with the access token.
				 */
				this.emit("refresh", body);
				callback();
			});
		});
			
	}

	/**
	 * Check validity of access token.
	 * @param {function} callback - The callback function.
	 */
	_validate(callback){
		const options = {
			url: "https://id.twitch.tv/oauth2/validate",
			headers: {
				"Authorization": "OAuth "+this.access_token
			}
		};

		request(options, (err, response, body) => {
			if(err) this._error(err);
			const message = JSON.parse(body).message;
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

			callback(valid);
		});
	}

	/**
	 * Send a GET request to the specified api endpoint.
	 * @param {string} endpoint - The endpoint to get.
	 * @param {function} callback - The callback function containing results.
	 * @private
	 */
	_get(endpoint, callback){
		const options = {
			url: this.base+endpoint,
			method: "GET",
			headers: {
				"Client-ID": this.client_id,
				"Authorization": "Bearer "+this.access_token
			}
		}

		request(options, (err, response, body) => {
			if(err) this._error(err);
			const status = response.statusCode;
			const message = JSON.parse(body).message;

			if(status >= 400){
				const err_msg = `\nGet request to ${options.url} failed:\n`+
				`${status} ${response.statusMessage}: ${message}\n`;
				const err_obj = {
					type: "http",
					code: status,
					statusMessage: response.statusMessage,
					message: message
				}

				console.error(err_msg);

				/**
				 * Error event emitted when something fails in the api.
				 * @event TwitchApi#error
				 * @type {object}
				 * @property {string} type - The type of error, eg. "http"
				 * @property {number} code - The status code of the http request. 
				 * @property {string} statusMessage - Short message explaining the error.
				 * @property {string} message - Long message explaining the error.
				 */
				this.emit("error", err_obj);
			}

			if(status >= 400){	
				this._refresh( () => {
					this._get(endpoint, callback);
				});

				return;
			}

			callback(JSON.parse(body), response);
		});
	}

	/**
	 * Send a POST request to the specified api endpoint.
	 * @param {string} endpoint - The endpoint to call.
	 * @param {object} data - The json object of data to post.
	 * @param {function} callback - The callback function.
	 * @private
	 */
	_post(endpoint, data, callback){
		const options = {
			url: this.base+endpoint,
			method: "POST",
			json: true,
			body: data,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer "+this.access_token,
				"Client-ID": this.client_id
			}
		}

		request(options, (err, response, body) => {
			if(err) this._error(err);
			const status = response.statusCode;
			const message = JSON.parse(body).message;

			if(status >= 400){
				const err_msg = `\nPost request to ${options.url} failed:\n`+
				`${status} ${response.statusMessage}: ${message}\n`;
				const err_obj = {
					type: "http",
					code: status,
					statusMessage: response.statusMessage,
					message: message
				}

				console.error(err_msg);

				this.emit("error", err_obj);
			}

			if(status === 401){
				this.refresh_token(() => {
					this._post(endpoint, callback);
				});

				return;
			}

			callback(JSON.parse(body), response);
		});
	}


	/* 
	****************
	PUBLIC METHODS
	**************** 
	*/

	// GET REQUESTS

	/**
	 * Get the bits leaderboard of a user or top users.
	 * @param {object} options - The options for the request.
	 * @param {function} callback - The callback function.
	 */
	getBitsLeaderboard(options, callback){
		let query = "?";
		query += methods.parseOptions(options);

		const endpoint = "/bits/leaderboard"+query;
		this._get(endpoint, callback);
	}

	/**
	 * Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.
	 * @param {array | string} ids - A list of ids and/or login names for the users to get. 
	 * @param {function} callback - The function that will be called when execution is finished.
	 */
	getUsers(ids, callback){
		let query = "";

		if(typeof ids === "string"){
			let type = isNaN(ids) ? "login" : "id";

			query = `?${type}=${ids}`;
		}else{
			for(let id of ids){
				let type = isNaN(id) ? "login" : "id";
	
				if(ids.indexOf(id) === 0){
					query += `?${type}=${id}`;
				}else{
					query += `&${type}=${id}`;
				}
			}
		}

		const endpoint = "/users"+query;

		this._get(endpoint, callback);
	}

	/**
	 * Gets the currently authenticated users profile information.
	 * @param {function} callback - The callback function.
	 */
	getCurrentUser(callback){
		const endpoint = "/users";

		this._get(endpoint, callback);
	}

	/**
	 * Get follows to or from a channel.
	 * @param {object} options - The options to customize the request.
	 * @param {function} callback - The callback function.
	 */
	getFollows(options, callback){
		let query = "?";
		query += methods.parseOptions(options);

		const endpoint = "/users/follows"+query;
		this._get(endpoint, callback);
	}

	/**
	 * Get subscribers from a channel/broadcaster id.
	 * @param {string | number} broadcaster_id - The id of the twitch channel to get subscribers from.
	 * @param {function} callback - The callback function.
	 */
	getSubsById(broadcaster_id, callback){
		const query = `?broadcaster_id=${broadcaster_id}`;
		const endpoint = "/subscriptions"+query;

		this._get(endpoint, callback);
	}

	/**
	 * Get subscription status of users to the current broadcaster.
	 * @param {string | array} user_ids - The user id/ids to check against the currently authenticated user.
	 * @param {function} callback - The callback function.
	 */
	getUsersSubStatus(user_ids, callback){
		let query = "?";

		this.getCurrentUser( body => {
			const user = body.data[0];

			query += `broadcaster_id=${user.id}`;

			if(typeof user_ids === "string"){
				query += "&user_id="+user_ids;
			}else{
				user_ids.forEach( id => {
					query += "&user_id="+id;
				});
			}

			const endpoint = "/subscriptions"+query;
			this._get(endpoint, callback);
		});
			
	}

	/**
	 * Get one or more live streams.
	 * @param {object} options - An options object used to create the request.
	 * @param {string} [options.after] - 	Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
	 * @param {string} [options.before] - Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
	 * @param {string} [options.community_id] - Returns streams in a specified community ID. You can specify up to 100 IDs.
	 * @param {number} [options.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
	 * @param {string} [options.game_id] - Returns streams broadcasting a specified game ID. You can specify up to 100 IDs.
	 * @param {string | array} options.channels - A list of user ids and/or user login names, or a string of a single user id or user login name.
	 * @param {function} callback - The function that will be called when execution is finished.
	 */
	getStreams(options, callback){
		if(!options.channels)
			this._error("Channels not specified in getStreams()");

		if(!callback)
			this._error("No callback function passed to getStreams()");
		
		let query = "?";
		const channels = options.channels;
		delete options.channels;

		query += methods.parseOptions(options);

		if(channels){
			if(typeof channels === "string"){
				const type = isNaN(channels) ? "user_login" : "user_id";

				query += `${type}=${channels}&`;
			}else{
				for(let channel of channels){
					const type = isNaN(channel) ? "user_login" : "user_id";

					query += `${type}=${channel}&`;
				}
			}
		}

		const endpoint = "/streams"+query;
		this._get(endpoint, callback);
	}

	/**
	 * Make a request to an endpoint that doesn't have a function.
	 * @param {string} endpoint - The endpoint to call including query parameters eg. "/games?id=493057"
	 * @param {object} options - A request options object, see the <a href="https://www.npmjs.com/package/request#requestoptions-callback">request module</a> for all available options. The url parameter will be overwritten by the first argument of the function, so there is no need to specify it.
	 */
	customRequest(endpoint, options, callback){
		if(typeof endpoint !== "string" || endpoint === "" || !endpoint){
			this._error("No endpoint was provided, cannot perform custom request.");
		}
			
		if(endpoint[0] !== "/")
			endpoint = "/"+endpoint;

		const headers = {
			"Client-ID": this.client_id,
			"Authorization": "Bearer "+this.access_token
		};

		options.url = this.base+endpoint;
		options.headers = Object.assign(headers, options.headers);

		request(options, (err, response, body) => {
			if(err) throw new Error(err);

			if(response.statusCode >= 400){
				console.log(`\Custom request to ${options.url} failed:\n`+
				`${response.statusCode} ${response.statusMessage}: ${JSON.parse(body).message}\n`);
			}

			callback(JSON.parse(body), response);
		});
	}
}

module.exports = TwitchApi;