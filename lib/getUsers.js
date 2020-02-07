/**
 * Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.
 * @param {string|string[]} ids - A list of ids and/or login names for the users to get.
 * @param {apiCallback} [callback] - The function that will be called when execution is finished.
*/
async function getUsers (ids, callback){
	let query = "";

	if(typeof ids === "string"){
		let type = isNaN(ids) ? "login" : "id";

		query = `?${type}=${ids}`;
	}else{
		for(let id of ids){
			let type = isNaN(id) ? "login" : "id";

			if(ids.indexOf(id) === 0)
				query += `?${type}=${id}`;
			else
				query += `&${type}=${id}`;
		}
	}

	const endpoint = "/users" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
};

module.exports = getUsers;
