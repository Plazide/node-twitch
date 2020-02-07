/**
 * Gets the currently authenticated users profile information.
 * @param {apiCallback} [callback] - The callback function.
*/
async function getCurrentUser (callback){
	if(this.isApp)
		this._error("Cannot get the current user when using an application token. Use access_token and refresh_token instead.");

	const endpoint = "/users";

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getCurrentUser;
