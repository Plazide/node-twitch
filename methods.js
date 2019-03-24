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
		if(err && err.code === "ENOENT"){
			fs.mkdir("./data", err => {
				if(err) throw new Error(err);

				setApiUser(config);
				return 0;
			});
		}
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

module.exports = {
	getLocalAccessToken,
	getLocalRefreshToken,
	getLocalClientId,
	getLocalClientSecret,
	setApiUser,
	parseOptions
}