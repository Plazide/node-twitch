/**
 * Get subscribers from a channel/broadcaster id.
 * @param {string|number} broadcasterId - The id of the twitch channel to get subscribers from.
 * @param {apiCallback} [callback] - The callback function.
*/
async function getSubsById (broadcasterId, callback){
	const query = `?broadcaster_id=${broadcasterId}`;
	const endpoint = "/subscriptions" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getSubsById;
