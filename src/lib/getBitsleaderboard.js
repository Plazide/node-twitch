const{ parseOptions } = require("../methods");

/**
 * Get the bits leaderboard of a user or top users.
 * @param {Object} options - The options for the request.
 * @param {number} [options.count] - Number of results to be returned. Maximum: 100. Default: 10.
 * @param {string} [options.period] - Time period over which data is aggregated (PST time zone). This parameter interacts with started_at. Valid values are given below. Default: "all". For more information visit the <a href="https://dev.twitch.tv/docs/api/reference/#get-bits-leaderboard">official api docs</a>.
 * @param {string} [options.started_at] - Timestamp for the period over which the returned data is aggregated. Must be in RFC 3339 format. Ignored if period is "all".
 * @param {string} [options.user_id] - ID of the user whose results are returned; i.e., the person who paid for the Bits. If user_id is not provided, the endpoint returns the Bits leaderboard data across top users (subject to the value of count).
 * @param {apiCallback} [callback] - The callback function.
 * @memberof TwitchApi
 * @inner
*/
async function getBitsLeaderboard(options, callback){
	let query = "?";
	query += parseOptions(options);

	const endpoint = "/bits/leaderboard" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getBitsLeaderboard;
