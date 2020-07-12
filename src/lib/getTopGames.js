const{ parseOptions } = require("../methods");

/**
 *
 * @param {object} [options] - The options for the request.
 * @param {number} [options.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
 * @param {string} [options.after] - Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {string} [options.before] - Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {function} callback - The callback function.
 * @memberof TwitchApi
 * @inner
 */
async function getTopGames(options, callback){
	const query = parseOptions(options);
	const endpoint = "/games/top?" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getTopGames;
