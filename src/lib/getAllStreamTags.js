/* eslint-disable camelcase */

const{ parseOptions } = require("../methods");
/**
 * Gets the list of all stream tags defined by Twitch, optionally filtered by tag ID(s).
 * @param {Object} [options] - The options for making the request.
 * @param {Number} [options.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
 * @param {String} [options.after] - Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query.
 * @param {String|String[]} [options.tag_id] - ID of a tag. Array of IDs can be specified. If provided, only the specified tag(s) is(are) returned. Maximum of 100.
 * @param {apiCallback} [callback] - Function to be called when execution has finished.
 */
async function getAllStreamTags({ first, after, tag_id }, callback){
	if(first && typeof first !== "number")
		throw new TypeError("expected `first` to be type number, got " + typeof first);

	if(after && typeof after !== "string")
		throw new TypeError("expected `after` to be type string, got " + typeof after);

	if(tag_id && typeof tag_id !== "string" && !Array.isArray(tag_id))
		throw new TypeError("expected `tag_id` to be of type string or array, got " + typeof tag_id);

	const query = "?" + parseOptions({ first, after, tag_id });
	const endpoint = "/tags/streams" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getAllStreamTags;
