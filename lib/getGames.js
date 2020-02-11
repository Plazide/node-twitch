const{ parseMixedParam } = require("../methods");

/**
 * Get games by their name or id.
 * @param {string[]|number[]|string} games - Array of numbers representing game ids and/or strings representing the exact name of games.
 * @param {function} callback - Function to be called when execution has finished.
 */
async function getGames(games, callback){
	console.log(games);
	if(!Array.isArray(games) && typeof games !== "string")
		this._error("games must be either a string or an array of strings and/or numbers");

	let query = "?";
	query += parseMixedParam({ values: games, string: "name", numeric: "id" });

	const endpoint = "/games" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getGames;
