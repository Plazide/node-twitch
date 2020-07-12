const{ parseMixedParam } = require("../methods");

/**
 * Get games by their name or id.
 * @param {string[]|number[]|string|number} games - Array of numbers representing game ids and/or strings representing the exact name of games.
 * @param {function} [callback] - Function to be called when execution has finished.
 * @memberof TwitchApi
 * @inner
 */
async function getGames(games, callback){
	if(!Array.isArray(games) && typeof games !== "string" && typeof games !== "number")
		this._error("games must be either a string or number or an array of strings and/or numbers");

	let query = "?";
	query += parseMixedParam({ values: games, string: "name", numeric: "id" });

	const endpoint = "/games" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getGames;
