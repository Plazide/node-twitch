/**
 * Get subscription status of users to the current broadcaster.
 * @param {string|string[]} user_ids - The user id/ids to check against the currently authenticated user.
 * @param {apiCallback} [callback] - The callback function.
 * @memberof TwitchApi
 * @inner
*/
async function getUsersSubStatus(userIds, callback){
	let query = "?";

	const body = await this.getCurrentUser(userIds);
	const user = body.data[0];

	query += `broadcaster_id=${user.id}`;

	if(typeof userIds === "string")
		query += "&user_id=" + userIds;
	else
		userIds.forEach( id => {
			query += "&user_id=" + id;
		});

	const endpoint = "/subscriptions" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getUsersSubStatus;
