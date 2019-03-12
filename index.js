const request = require("request");
const { EventEmitter } = require("events");
const methods = require("./methods");

/**
 * Class to control access to the Twitch api.
 * @fires TwitchApi#refresh - Fired when access token is refreshed.
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

		methods.setApiUser(config);
	}
	

	/*****************
	PRIVATE METHODS
	*****************/
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

		request(options, (err, response, body) => {
			if(err) this._error(err);

			const access_token = body.access_token;
			const refresh_token = body.refresh_token;

			if(access_token)
				this.access_token = access_token;

			if(refresh_token)
				this.refresh_token = refresh_token;

			/**
			 * Refresh event fired when the access token is refreshed. Listening to this event lets you save new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically.
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

			if(status >= 400){
				console.error(`\nGet request to ${options.url} failed:\n`+
				`${status} ${response.statusMessage}: ${JSON.parse(body).message}\n`);
			}

			if(status === 401){
				this._refresh( () => {
					this._get(endpoint, callback);
				});

				return;
			}

			callback(response, JSON.parse(body));
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

			if(status >= 400){
				console.error(`\Post request to ${options.url} failed:\n`+
				`${status} ${response.statusMessage}: ${JSON.parse(body).message}\n`);
			}

			if(status === 401){
				this.refresh_token(() => {
					this._post(endpoint, callback);
				});

				return;
			}

			callback(response, JSON.parse(body));
		});
	}


	/*****************
	PUBLIC METHODS
	*****************/
	/**
	 * Make a request to an endpoint that doesn't have a function.
	 * @param {string} endpoint - The endpoint to call eg. "/games?id=493057"
	 * @param {object} options - A request options object not including url key
	 */
	customRequest(endpoint, options, callback){
		if(typeof endpoint !== "string" || endpoint === "" || !endpoint){
			this._error("No endpoint was provided, cannot perform custom request.");
			return 0;
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

			callback(response, JSON.parse(body));
		});
	}


	// GET REQUESTS

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
	 * Get subscriptions status of users to a broadcaster.
	 * @param {object} options - An object containing a broadcaster_id and one or more user_ids.
	 * @param {function} callback - The callback function.
	 */
	getSubsStatus(options, callback){
		let query = "?";

		query += `broadcaster_id=${options.broadcaster_id}`;

		if(typeof options.user_ids === "string"){
			query += "&user_id="+options.user_ids;
		}else{
			options.user_ids.forEach( id => {
				query += "&user_id="+id;
			});
		}

		const endpoint = "/subscriptions"+query;
		this._get(endpoint, callback);
	}

	/**
	 * Get one or more live streams.
	 * @param {object} options - A options object used to create the request.
	 * @param {function} callback - The function that will be called when execution is finished.
	 */
	getStreams(options, callback){
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
}

module.exports = TwitchApi;