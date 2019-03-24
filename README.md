# node-twitch
This package aims to simplify calls to the Twitch api by making the endpoints available through simple method calls.

### Early version
The aim of this package is to make all twitch endpoints available through method calls in a single class. So far, the supported endpoints are limited. Therefore, a `customRequest()` method has been added to the api class. It lets you call any endpoint on the Twitch api using the authentication information already provided. For more info on this see [Unsupported endpoints](#unsupported-endpoints).

## Installation

To install simply do,
```sh
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
The biggest difference when using async/await is that the response object won't be available. Keep this in mind when deciding which syntax you'd like use for your project.

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

## Classes

<dl>
<dt><a href="#TwitchApi">TwitchApi</a></dt>
<dd><p>Class to control access to the Twitch api.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#apiCallback">apiCallback</a> : <code>function</code></dt>
<dd><p>Api response callback.</p>
</dd>
<dt><a href="#apiError">apiError</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="TwitchApi"></a>

## TwitchApi
Class to control access to the Twitch api.

**Kind**: global class
**Emits**: <code>TwitchApi#event:ready - Fired when the api is ready to use.</code>, <code>TwitchApi#event:refresh - Fired when access token is refreshed.</code>, <code>TwitchApi#event:error - Fired when something goes wrong.</code>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| user | <code>Object</code> | Object containing information about the currently authenticated user. |
| user.broadcaster_type | <code>string</code> | User's broadcaster type: "partner", "affiliate", or "". |
| user.description | <code>string</code> | User's channel description. |
| user.display_name | <code>string</code> | User's display_name. |
| user.email | <code>string</code> | User's email address. Is only included if scope user:read:email was included in the authentication scopes. |
| user.id | <code>string</code> | User's ID. |
| user.login | <code>string</code> | User's login name. |
| user.offline_image_url | <code>string</code> | URL of the user's offline image. |
| user.profile_image_url | <code>string</code> | URL of the user's profile image. |
| user.type | <code>string</code> | User's type: "staff", "admin", "global_mod", or "". |
| user.view_count | <code>number</code> | Total number of views of the user's channel. Does not update overtime. |


* [TwitchApi](#TwitchApi)
    * [new TwitchApi(config)](#new_TwitchApi_new)
    * [.getBitsLeaderboard(options, [callback])](#TwitchApi+getBitsLeaderboard)
    * [.getUsers(ids, [callback])](#TwitchApi+getUsers)
    * [.getCurrentUser([callback])](#TwitchApi+getCurrentUser)
    * [.getFollows(options, [callback])](#TwitchApi+getFollows)
    * [.getSubsById(broadcaster_id, [callback])](#TwitchApi+getSubsById)
    * [.getUsersSubStatus(user_ids, [callback])](#TwitchApi+getUsersSubStatus)
    * [.getStreams([options], [callback])](#TwitchApi+getStreams)
    * [.customRequest(endpoint, options, [callback])](#TwitchApi+customRequest)
    * ["ready"](#TwitchApi+event_ready)
    * ["ready"](#TwitchApi+event_ready)
    * ["refresh"](#TwitchApi+event_refresh)
    * ["error"](#TwitchApi+event_error)

<a name="new_TwitchApi_new"></a>

### new TwitchApi(config)
Initialize the api.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | A configuration object containing your client_id and client_secret, as well as an access_token and refresh_token. |
| config.client_id | <code>string</code> | Your client id. |
| config.client_secret | <code>string</code> | Your client secret. |
| [config.access_token] | <code>string</code> | The access token from an authenticated user. |
| [config.refresh_token] | <code>string</code> | The refresh token from an authenticated user. |
| [config.isApp] | <code>bool</code> | A boolean value that determines whether or not the api should fetch an app access token. When using this option, you are only able to access public user information. |

<a name="TwitchApi+getBitsLeaderboard"></a>

### twitchApi.getBitsLeaderboard(options, [callback])
Get the bits leaderboard of a user or top users.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options for the request. |
| [options.count] | <code>number</code> | Number of results to be returned. Maximum: 100. Default: 10. |
| [options.period] | <code>string</code> | Time period over which data is aggregated (PST time zone). This parameter interacts with started_at. Valid values are given below. Default: "all". For more information visit the <a href="https://dev.twitch.tv/docs/api/reference/#get-bits-leaderboard">official api docs</a>. |
| [options.started_at] | <code>string</code> | Timestamp for the period over which the returned data is aggregated. Must be in RFC 3339 format. Ignored if period is "all". |
| [options.user_id] | <code>string</code> | ID of the user whose results are returned; i.e., the person who paid for the Bits. If user_id is not provided, the endpoint returns the Bits leaderboard data across top users (subject to the value of count). |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getUsers"></a>

### twitchApi.getUsers(ids, [callback])
Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A list of ids and/or login names for the users to get. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The function that will be called when execution is finished. |

<a name="TwitchApi+getCurrentUser"></a>

### twitchApi.getCurrentUser([callback])
Gets the currently authenticated users profile information.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getFollows"></a>

### twitchApi.getFollows(options, [callback])
Get follows to or from a channel. Must provide either from_id or to_id.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | The options to customize the request. |
| [options.after] | <code>string</code> | Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. |
| [options.first] | <code>number</code> | Maximum number of objects to return. Maximum: 100. Default: 20. |
| options.from_id | <code>string</code> | User ID. Return list of channels that the supplied user is following. |
| options.to_id | <code>string</code> | User ID. Return list of users who are following the supplied channel. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getSubsById"></a>

### twitchApi.getSubsById(broadcaster_id, [callback])
Get subscribers from a channel/broadcaster id.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| broadcaster_id | <code>string</code> \| <code>number</code> | The id of the twitch channel to get subscribers from. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getUsersSubStatus"></a>

### twitchApi.getUsersSubStatus(user_ids, [callback])
Get subscription status of users to the current broadcaster.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| user_ids | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The user id/ids to check against the currently authenticated user. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getStreams"></a>

### twitchApi.getStreams([options], [callback])
Get one or more live streams.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>Object</code> | An options object used to create the request. |
| [options.after] | <code>string</code> | Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. |
| [options.before] | <code>string</code> | Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field
of a prior query. |
| [options.community_id] | <code>string</code> | Returns streams in a specified community ID. You can specify up to 100 IDs. |
| [options.first] | <code>number</code> | Maximum number of objects to return. Maximum: 100. Default: 20. |
| [options.game_id] | <code>string</code> | Returns streams broadcasting a specified game ID. You can specify up to 100 IDs. |
| [options.channels] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A list of user ids and/or user login names, or a string of a single user id or user login name. This is not a native twitch api parameter. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The function that will be called when execution is finished. |

<a name="TwitchApi+customRequest"></a>

### twitchApi.customRequest(endpoint, options, [callback])
Make a request to an endpoint that doesn't have a function.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | The endpoint to call including query parameters eg. "/games?id=493057" |
| options | <code>Object</code> | A request options object, see the <a href="https://www.npmjs.com/package/request#requestoptions-callback">request module</a> for all available options. The url parameter will be overwritten by the first
argument of the function, so there is no need to specify it. |
| [callback] | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+event_ready"></a>

### "ready"
Event fired when the api is ready to use.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
<a name="TwitchApi+event_ready"></a>

### "ready"
Event fired when the api is ready to use.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
<a name="TwitchApi+event_refresh"></a>

### "refresh"
Refresh event fired when the access token is refreshed. Listening to this event lets you access new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| access_token | <code>string</code> | The new access token. |
| refresh_token | <code>string</code> | The new refresh token. Is not always included. |
| expires_in | <code>number</code> | The amount of time in seconds until the access token expires. |
| scope | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The scopes associated with the access token. |

<a name="TwitchApi+event_error"></a>

### "error"
Error event emitted when something fails in the api.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
<a name="apiCallback"></a>

## apiCallback : <code>function</code>
Api response callback.

**Kind**: global typedef

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | A json parsed object containing the body of the response. |
| response | <code>Object</code> | The entire response object from the request. |

<a name="apiError"></a>

## apiError : <code>Object</code>
**Kind**: global typedef
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of error, eg. "http" |
| code | <code>number</code> | The status code of the http request. |
| statusMessage | <code>string</code> | Short message explaining the error. |
| message | <code>string</code> | Long message explaining the error. |
