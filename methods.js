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

function setApiUser(access_token, refresh_token, client_id, client_secret){
	const data = JSON.stringify({
		access_token,
		refresh_token,
		client_id,
		client_secret
	});

	fs.writeFile(userFile, data, err => {
		if(err && err.code === "ENOENT"){
			fs.mkdir("./data", err => {
				if(err) throw new Error(err);

				setApiUser(access_token, refresh_token, client_id, client_secret);
				return 0;
			});
		}

		console.log("Updated tokens on disk!");
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
	setApiUser,
	parseOptions
}