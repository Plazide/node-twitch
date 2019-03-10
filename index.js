const request = require("request");
const methods = require("./methods");

/**
 * Class to control access to the Twitch api.
 */
class TwitchApi{
	/**
	 * Initialize the api.
	 * @param {string} access_token - Your access token
	 * @param {string} refresh_token - Your refresh token
	 * @param {string} client_id - Your client id
	 * @param {string} client_secret - Your client secret
	 */
	constructor(config){
		this.access_token = config.access_token || methods.getLocalAccessToken();
		this.refresh_token = config.refresh_token || methods.getLocalRefreshToken();
		this.client_id = config.client_id || methods.getLocalClientId();
		this.client_secret = config.client_secret || methods.getLocalClientSecret();
		this.base = "https://api.twitch.tv/helix";

		methods.setApiUser(config);
	}

	/**
	 * Send a GET request to the specified api endpoint.
	 * @param {string} endpoint - The endpoint to get.
	 * @param {function} callback - The callback function containing results.
	 */
	get(endpoint, callback){
		const options = {
			url: this.base+endpoint,
			method: "GET",
			headers: {
				"Client-ID": this.client_id,
				"Authorization": "Bearer "+this.access_token
			}
		}

		request(options, (err, response, body) => {
			if(err) throw new Error(err);

			if(response.statusCode >= 400){
				console.log(`\nGet request to ${options.url} failed:\n`+
				`${response.statusCode} ${response.statusMessage}: ${JSON.parse(body).message}\n`);
			}

			callback(response, JSON.parse(body));
		});
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

		this.get(endpoint, callback);
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
		this.get(endpoint, callback);
	}

	/**
	 * Get subscribers from a channel/broadcaster id.
	 * @param {string | number} broadcaster_id - The id of the twitch channel to get subscribers from.
	 * @param {function} callback - The callback function.
	 */
	getSubs(broadcaster_id, callback){
		const query = `?broadcaster_id=${broadcaster_id}`;
		const endpoint = "/subscriptions"+query;

		this.get(endpoint, callback);
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
		this.get(endpoint, callback);
	}
}

module.exports = TwitchApi;