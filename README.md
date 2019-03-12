# node-twitch-api
A wrapper for the Helix twitch api in NodeJS.

<a name="TwitchApi"></a>

## TwitchApi
Class to control access to the Twitch api.

**Kind**: global class
**Emits**: <code>TwitchApi#event:refresh - Fired when access token is refreshed.</code>, <code>TwitchApi#event:error - Fired when something goes wrong.</code>

* [TwitchApi](#TwitchApi)
    * [new TwitchApi(config)](#new_TwitchApi_new)
    * [.getBitsLeaderboard(options, callback)](#TwitchApi+getBitsLeaderboard)
    * [.getUsers(ids, callback)](#TwitchApi+getUsers)
    * [.getCurrentUser(callback)](#TwitchApi+getCurrentUser)
    * [.getFollows(options, callback)](#TwitchApi+getFollows)
    * [.getSubsById(broadcaster_id, callback)](#TwitchApi+getSubsById)
    * [.getUsersSubStatus(user_ids, callback)](#TwitchApi+getUsersSubStatus)
    * [.getStreams(options, callback)](#TwitchApi+getStreams)
    * [.customRequest(endpoint, options)](#TwitchApi+customRequest)
    * ["refresh"](#TwitchApi+event_refresh)
    * ["error"](#TwitchApi+event_error)

<a name="new_TwitchApi_new"></a>

### new TwitchApi(config)
Initialize the api.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object containing your client_id and client_secret, as well as an access_token and refresh_token. |

<a name="TwitchApi+getBitsLeaderboard"></a>

### twitchApi.getBitsLeaderboard(options, callback)
Get the bits leaderboard of a user or top users.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options for the request. |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getUsers"></a>

### twitchApi.getUsers(ids, callback)
Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>array</code> \| <code>string</code> | A list of ids and/or login names for the users to get. |
| callback | <code>function</code> | The function that will be called when execution is finished. |

<a name="TwitchApi+getCurrentUser"></a>

### twitchApi.getCurrentUser(callback)
Gets the currently authenticated users profile information.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getFollows"></a>

### twitchApi.getFollows(options, callback)
Get follows to or from a channel.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options to customize the request. |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getSubsById"></a>

### twitchApi.getSubsById(broadcaster_id, callback)
Get subscribers from a channel/broadcaster id.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| broadcaster_id | <code>string</code> \| <code>number</code> | The id of the twitch channel to get subscribers from. |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getUsersSubStatus"></a>

### twitchApi.getUsersSubStatus(user_ids, callback)
Get subscription status of users to the current broadcaster.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| user_ids | <code>string</code> \| <code>array</code> | The user id/ids to check against the currently authenticated user. |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getStreams"></a>

### twitchApi.getStreams(options, callback)
Get one or more live streams.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | An options object used to create the request. |
| [options.after] | <code>string</code> | Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. |
| [options.before] | <code>string</code> | Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field
of a prior query. |
| [options.community_id] | <code>string</code> | Returns streams in a specified community ID. You can specify up to 100 IDs. |
| [options.first] | <code>number</code> | Maximum number of objects to return. Maximum: 100. Default: 20. |
| [options.game_id] | <code>string</code> | Returns streams broadcasting a specified game ID. You can specify up to 100 IDs. |
| options.channels | <code>string</code> \| <code>array</code> | A list of user ids and/or user login names, or a string of a single user id or user login name. |
| callback | <code>function</code> | The function that will be called when execution is finished. |

<a name="TwitchApi+customRequest"></a>

### twitchApi.customRequest(endpoint, options)
Make a request to an endpoint that doesn't have a function.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | The endpoint to call including query parameters eg. "/games?id=493057" |
| options | <code>object</code> | A request options object, see the <a href="https://www.npmjs.com/package/request#requestoptions-callback">request module</a> for all available options. The url parameter will be overwritten by the first
argument of the function, so there is no need to specify it. |

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
| scope | <code>array</code> \| <code>string</code> | The scopes associated with the access token. |

<a name="TwitchApi+event_error"></a>

### "error"
Error event emitted when something fails in the api.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of error, eg. "http" |
| code | <code>number</code> | The status code of the http request. |
| statusMessage | <code>string</code> | Short message explaining the error. |
| message | <code>string</code> | Long message explaining the error. |