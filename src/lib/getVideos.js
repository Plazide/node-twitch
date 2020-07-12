const{ parseOptions, parseArrayToQueryString } = require("../methods");

/**
 * Fetch videos by a user id, game id, or one or more video ids. Only one of these can be specified at a time.
 * @param {object} options
 * @param {string[]} options.ids - Array of video ids. If this is specified, you cannot use any of the optional parameters.
 * @param {string} options.user_id - User to fetch videos from.
 * @param {string} options.game_id - Id of the game that the video is of.
 * @param {string} [options.after] - Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {string} [options.before] - Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {number} [options.first] - Number of values to be returned when getting videos by user or game ID. Limit: 100. Default: 20.
 * @param {string} [options.language] - Language of the video being queried. Limit: 1.
 * @param {string} [options.period] - Period during which the video was created. Valid values: "all", "day", "week", "month". Default: "all".
 * @param {string} [options.sort] - Sort order of the videos. Valid values: "time", "trending", "views". Default: "time".
 * @param {string} [options.type] - Type of video. Valid values: "all", "upload", "archive", "highlight". Default: "all".
 * @param {function} callback - Function to be called when data has been fetched.
 * @memberof TwitchApi
 * @inner
 */
async function getVideos(options, callback){
	let query = "?";
	const ids = options.ids;
	if(ids){
		delete options.ids;
		query += parseArrayToQueryString("id", ids);
	}

	query += parseOptions(options);

	const endpoint = "/videos" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getVideos;
