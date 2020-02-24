const{ parseOptions } = require("../methods");

/**
 *
 * @param {object} [options] - The options for the request.
 * @param {number} []
 * @param {function} callback - The callback function.
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
