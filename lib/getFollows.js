const{ parseOptions } = require("../methods");

/**
 * Get follows to or from a channel. Must provide either from_id or to_id.
 * @param {Object} options - The options to customize the request.
 * @param {string} [options.after] - Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {number} [options.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
 * @param {string} options.from_id -  User ID. Return list of channels that the supplied user is following.
 * @param {string} options.to_id - User ID. Return list of users who are following the supplied channel.
 * @param {apiCallback} [callback] - The callback function.
*/
async function getFollows (options, callback){
	let query = "?";

	if(options)
		query += parseOptions(options);

	const endpoint = "/users/follows" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getFollows;
