# node-twitch
This package aims to simplify calls to the Twitch api by making the endpoints available through simple method calls.

### Early version
The aim of this package is to make all twitch endpoints available through method calls in a single class. So far, the supported endpoints are limited. Therefore, a `customRequest()` method has been added to the api class. It lets you call any endpoint on the Twitch api using the authentication information already provided. For more info on this see [Unsupported endpoints](#unsupported-endpoints).

## Installation

To install simply do,
```bash
npm install node-twitch
```

## Usage
Before using this package, you will have to create an application on twitch to retrieve a `client_id` and `client_secret`. Use the [official documentation](https://dev.twitch.tv/docs/authentication/#registration) as a guide.

Refer to the example below for a basic usage guide.
```js
const TwitchApi = require("node-twitch");

// Create a new instance of the TwitchApi class and use an app access token to authenticate requests.
const api = new TwitchApi({
	client_id: "YOUR TWITCH CLIENT ID",
	client_secret: "YOUR CLIENT SECRET",
	isApp: true // When this option is enabled, an application token will be automatically acquired from twitch.
});

// Wait for the api to start.
api.on("ready", () => {
	// Set the options for the request.
	const options = {
		// Channels accepts a string or an array of strings representing either a user_id or a user's login name.
		channels: ["lirik", "shroud"]
	}

	// Call the streams endpoint.
	// The callback contains a body and a response object.
	// The body is the result returned from twitch,
	// while the response contains the http request information.
	api.getStreams(options, (body, response) => {
		console.log(body.data[0].user_name); // Should print "LIRIK" if the stream is live.
	});
});
```  
The example above has set the `isApp` option set to `true`, which means that the api will automatically request an application token from the twitch api using your `client_id` and `client_secret`. Using this option simplifies the setup process of the api, but it prevents you from accessing any non-public user data. If you need to access private user data, such as subscribers or a user's email, you will need to authenticate the user on the client side and send the `access_token` and `refresh_token` to the server. The process of retrieving these tokens are outside the scope of this package. Refer to the [official documentation](https://dev.twitch.tv/docs/authentication/) on how to authenticate a user.

To use the `access_token` and `refresh_token`, refer to the following example:
```js
const TwitchApi = require("node-twitch");

// Create a new instance of the TwitchApi class.
const api = new TwitchApi({
	client_id: "YOUR TWITCH CLIENT ID",
	client_secret:  "YOUR CLIENT SECRET",
	access_token: "A USER'S ACCESS TOKEN",
	refresh_token: "A USER'S REFRESH TOKEN"
});

// Wait for the api to start.
api.on("ready", () => {
	api.getCurrentUser( (body, response) => {
		console.log(body.data[0].display_name); // Prints the currently authenticated user's display name.
	});
});
```

It's worth noting that it is not necessary to wait for the `ready` event when using this method of authentication. In this case the the only thing the `ready` event indicates is that you can access the `api.user` object, which makes it easier to read the current user's data. 

### Async/Await
In addition to the syntax above, this package also uses promises, which means that you can use a async/await syntax if you'd like. The example below does the same thing as the first example, but using an async/await syntax.

```js
const TwitchApi = require("node-twitch");

// Create a new instance of the TwitchApi class and use an app access token to authenticate requests.
const api = new TwitchApi({
	client_id: "YOUR TWITCH CLIENT ID",
	client_secret: "YOUR CLIENT SECRET",
	isApp: true // When this option is enabled, an application token will be automatically acquired from twitch.
});

// Wait for the api to start.
api.on("ready", async () => { // Uses an async function!!
	// Set the options for the request.
	const options = {
		// Channels accepts a string or an array of strings representing either a user_id or a user's login name.
		channels: ["lirik", "shroud"]
	}

	// Call the streams endpoint.
	// Uses async/await instead of a callback.
	// This method does not return the full response object.
	const streams = await api.getStreams(options);
	console.log(streams.data[0].user_name); // Should print "LIRIK" if the stream is live.
	
});
```
The biggest difference when using async/await is that the response object won't be available. Keep this in mind when deciding which syntax you'd like to use for your project.

### Unsupported endpoints
If you wish to call an endpoint that is not yet supported by this package, refer to the following example:
```js
const TwitchApi = require("node-twitch");

const api = new TwitchApi({
	client_id: "YOUR TWITCH CLIENT ID",
	client_secret:  "YOUR CLIENT SECRET",
	access_token: "A USER'S ACCESS TOKEN",
	refresh_token: "A USER'S REFRESH TOKEN"
});

// A custom request to get videos from a user_id
api.customRequest("/videos?user_id=91919297", {method: "GET"}, body => {
	console.log(body.data); // Prints array of the specified user's videos.
});
```

For further information, read the documentation below.

# Documentation

- [Documentation](https://plazide.github.io/node-twitch/)
