const fs = require("fs");
const userFile = "./data/apiUser.json";

function getLocalAccessToken(){
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.access_token;
}

function getLocalRefreshToken(){
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.refresh_token;
}

function getLocalClientId(){
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.client_id;
}

function getLocalClientSecret(){
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.client_secret;
}

function setApiUser(config){
	fs.writeFile(userFile, JSON.stringify(config), err => {
		if(err && err.code === "ENOENT")
			fs.mkdir("./data", err => {
				if(err) throw new Error(err);

				setApiUser(config);
				return 0;
			});
	});
}

function parseOptions(options){
	let query = "";

	for(let key in options){
		const value = options[key];

		query += `${key}=${value}&`;
	}

	return query;
}

/**
 * Parse an array with mixed string and number types into a query string.
 * @param {object} options - Options for creating string.
 * @param {string} string - Key to use for string values.
 * @param {string} numeric - Key to use for numeric values.
 * @returns Query string
 */
function parseMixedParam({ values, string, numeric }){
	let query = "";

	if(values)
		if(typeof values === "string"){
			const type = isNaN(values) ? string : numeric;

			query += `${type}=${values}&`;
		}else{
			for(let value of values){
				const type = isNaN(value) ? string : numeric;

				query += `${type}=${value}&`;
			}
		}

	return query;
}

/**
 * Parse an array into a query string where every value has the same key.
 * @param {string} key - The key to use. This will be repeated in the query for every value in the array
 * @param {string[]|string} arr - Array of values to parse into query string.
 */
function parseArrayToQueryString(key, arr){
	const list = Array.isArray(arr) ? arr : [arr];
	const result = list.map( value => `${key}=${value}`).join("&");

	return result;
}

module.exports = {
	getLocalAccessToken,
	getLocalRefreshToken,
	getLocalClientId,
	getLocalClientSecret,
	setApiUser,
	parseOptions,
	parseMixedParam,
	parseArrayToQueryString
};
