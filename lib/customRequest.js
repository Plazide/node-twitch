const request = require("request-promise-native");

/**
 * Make a request to an endpoint that doesn't have a function.
 * @param {string} endpoint - The endpoint to call including query parameters eg. "/games?id=493057"
 * @param {Object} options - A request options object, see the <a href="https://www.npmjs.com/package/request#requestoptions-callback">request module</a> for all available options. The url parameter will be overwritten by the first argument of the function, so there is no need to specify it.
 * @param {apiCallback} [callback] - The callback function.
 * @memberof TwitchApi
 * @inner
*/
async function customRequest (endpoint, options, callback){
	try{
		if(typeof endpoint !== "string" || endpoint === "" || !endpoint)
			this._error("No endpoint was provided, cannot perform custom request.");

		if(endpoint[0] !== "/")
			endpoint = "/" + endpoint;

		const headers = {
			"Client-ID": this.client_id,
			"Authorization": "Bearer " + this.access_token
		};

		if(!options)
			options = {};

		if(typeof options !== "object")
			this._error("customRequest received an options parameter that was not of type object.");

		options.url = this.base + endpoint;
		options.headers = Object.assign(headers, options.headers);
		options.resolveWithFullResponse = true;
		options.simple = false;

		const response = await request(options).catch(err => { this._error(err); });
		const body = JSON.parse(response.body);

		if(response.statusCode >= 400)
			console.log(`Custom request to ${options.url} failed:\n` +
			`${response.statusCode} ${response.statusMessage}: ${body.message}\n`);

		if(callback)
			callback(body, response);
		else
			return body;
	}catch(err){
		throw err;
	}
};

module.exports = customRequest;
