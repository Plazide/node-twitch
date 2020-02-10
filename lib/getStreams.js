const{ parseOptions } = require("../methods");

/**
 * Get one or more live streams.
 * @param {Object} [options] - An options object used to create the request.
 * @param {string} [options.after] - 	Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {string} [options.before] - Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {string} [options.community_id] - Returns streams in a specified community ID. You can specify up to 100 IDs.
 * @param {number} [options.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
 * @param {string} [options.game_id] - Returns streams broadcasting a specified game ID. You can specify up to 100 IDs.
 * @param {string|string[]} [options.channels] - A list of user ids and/or user login names, or a string of a single user id or user login name. This is not a native twitch api parameter.
 * @param {apiCallback} [callback] - The function that will be called when execution is finished.
 * @memberof TwitchApi
 * @inner
*/
async function getStreams(options, callback){
	if(!options)
		options = {};

	let query = "?";
	const channels = options.channels;
	delete options.channels;

	query += parseOptions(options);

	if(channels)
		if(typeof channels === "string"){
			const type = isNaN(channels) ? "user_login" : "user_id";

			query += `${type}=${channels}&`;
		}else{
			for(let channel of channels){
				const type = isNaN(channel) ? "user_login" : "user_id";

				query += `${type}=${channel}&`;
			}
		}

	const endpoint = "/streams" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getStreams;
