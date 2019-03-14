# node-twitch
A wrapper for the Helix twitch api in NodeJS.

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
</dl>

<a name="TwitchApi"></a>

## TwitchApi
Class to control access to the Twitch api.

**Kind**: global class
**Emits**:   
<code>TwitchApi#event:ready - Fired when the api is ready to use.</code>,   
<code>TwitchApi#event:refresh - Fired when access token is refreshed.</code>,   
<code>TwitchApi#event:error - Fired when something goes wrong.</code>

* [TwitchApi](#TwitchApi)
    * [new TwitchApi(config)](#new_TwitchApi_new)
    * [.getBitsLeaderboard(options, callback)](#TwitchApi+getBitsLeaderboard)
    * [.getUsers(ids, callback)](#TwitchApi+getUsers)
    * [.getCurrentUser(callback)](#TwitchApi+getCurrentUser)
    * [.getFollows(options, callback)](#TwitchApi+getFollows)
    * [.getSubsById(broadcaster_id, callback)](#TwitchApi+getSubsById)
    * [.getUsersSubStatus(user_ids, callback)](#TwitchApi+getUsersSubStatus)
    * [.getStreams(options, callback)](#TwitchApi+getStreams)
    * [.customRequest(endpoint, options, callback)](#TwitchApi+customRequest)
    * ["ready"](#TwitchApi+event_ready)
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
| [options.count] | <code>number</code> | Number of results to be returned. Maximum: 100. Default: 10. |
| [options.period] | <code>string</code> | Time period over which data is aggregated (PST time zone). This parameter interacts with started_at. Valid values are given below. Default: "all". For more information visit the <a href="https://dev.twitch.tv/docs/api/reference/#get-bits-leaderboard">official api docs</a>. |
| [options.started_at] | <code>string</code> | Timestamp for the period over which the returned data is aggregated. Must be in RFC 3339 format. Ignored if period is "all". |
| [options.user_id] | <code>string</code> | ID of the user whose results are returned; i.e., the person who paid for the Bits. If user_id is not provided, the endpoint returns the Bits leaderboard data across top users (subject to the value of count). |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getUsers"></a>

### twitchApi.getUsers(ids, callback)
Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A list of ids and/or login names for the users to get. |
| callback | [<code>apiCallback</code>](#apiCallback) | The function that will be called when execution is finished. |

<a name="TwitchApi+getCurrentUser"></a>

### twitchApi.getCurrentUser(callback)
Gets the currently authenticated users profile information.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getFollows"></a>

### twitchApi.getFollows(options, callback)
Get follows to or from a channel. Must provide either from_id or to_id.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | The options to customize the request. |
| [options.after] | <code>string</code> | Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response. The cursor value specified here is from the pagination response field of a prior query. |
| [options.first] | <code>number</code> | Maximum number of objects to return. Maximum: 100. Default: 20. |
| options.from_id | <code>string</code> | User ID. Return list of channels that the supplied user is following. |
| options.to_id | <code>string</code> | User ID. Return list of users who are following the supplied channel. |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getSubsById"></a>

### twitchApi.getSubsById(broadcaster_id, callback)
Get subscribers from a channel/broadcaster id.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| broadcaster_id | <code>string</code> \| <code>number</code> | The id of the twitch channel to get subscribers from. |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

<a name="TwitchApi+getUsersSubStatus"></a>

### twitchApi.getUsersSubStatus(user_ids, callback)
Get subscription status of users to the current broadcaster.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| user_ids | <code>string</code> \| <code>Array.&lt;string&gt;</code> | The user id/ids to check against the currently authenticated user. |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

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
| options.channels | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A list of user ids and/or user login names, or a string of a single user id or user login name. This is not a native twitch api parameter. |
| callback | [<code>apiCallback</code>](#apiCallback) | The function that will be called when execution is finished. |

<a name="TwitchApi+customRequest"></a>

### twitchApi.customRequest(endpoint, options, callback)
Make a request to an endpoint that doesn't have a function.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | The endpoint to call including query parameters eg. "/games?id=493057" |
| options | <code>object</code> | A request options object, see the <a href="https://www.npmjs.com/package/request#requestoptions-callback">request module</a> for all available options. The url parameter will be overwritten by the first
argument of the function, so there is no need to specify it. |
| callback | [<code>apiCallback</code>](#apiCallback) | The callback function. |

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
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of error, eg. "http" |
| code | <code>number</code> | The status code of the http request. |
| statusMessage | <code>string</code> | Short message explaining the error. |
| message | <code>string</code> | Long message explaining the error. |

<a name="apiCallback"></a>

## apiCallback : <code>function</code>
Api response callback.

**Kind**: global typedef

| Param | Type | Description |
| --- | --- | --- |
| body | <code>object</code> | A json parsed object containing the body of the response. |
| response | <code>object</code> | The entire response object from the request. |
