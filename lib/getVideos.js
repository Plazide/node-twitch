const{ parseOptions, parseMixedParam } = require("../methods");

async function getVideos(ids, options, callback){
	let query = "?";
	query += parseOptions(options);
	query += parseMixedParam({ values: ids, numeric: "user_id" });

	const endpoint = "/videos" + query;

	if(callback)
		this._get(endpoint, callback);
	else
		return this._get(endpoint);
}

module.exports = getVideos;
