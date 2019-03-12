# node-twitch-api
A wrapper for the Helix twitch api in NodeJS.

<a name="TwitchApi"></a>

## TwitchApi
Class to control access to the Twitch api.

**Kind**: global class
**Emits**: <code>TwitchApi#event:refresh - Fired when access token is refreshed.</code>

* [TwitchApi](#TwitchApi)
    * [new TwitchApi(config)](#new_TwitchApi_new)
    * [.customRequest(endpoint, options)](#TwitchApi+customRequest)
    * [.getUsers(ids, callback)](#TwitchApi+getUsers)
    * [.getFollows(options, callback)](#TwitchApi+getFollows)
    * [.getSubsById(broadcaster_id, callback)](#TwitchApi+getSubsById)
    * [.getSubsStatus(options, callback)](#TwitchApi+getSubsStatus)
    * [.getStreams(options, callback)](#TwitchApi+getStreams)
    * ["refresh"](#TwitchApi+event_refresh)

<a name="new_TwitchApi_new"></a>

### new TwitchApi(config)
Initialize the api.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object containing your client_id and client_secret, as well as an access_token and refresh_token. |

<a name="TwitchApi+customRequest"></a>

### twitchApi.customRequest(endpoint, options)
Make a request to an endpoint that doesn't have a function.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | The endpoint to call eg. "/games?id=493057" |
| options | <code>object</code> | A request options object not including url key |

<a name="TwitchApi+getUsers"></a>

### twitchApi.getUsers(ids, callback)
Get one or more users by their login names or twitch ids. If only one user is needed, a single string will suffice.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>array</code> \| <code>string</code> | A list of ids and/or login names for the users to get. |
| callback | <code>function</code> | The function that will be called when execution is finished. |

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

<a name="TwitchApi+getSubsStatus"></a>

### twitchApi.getSubsStatus(options, callback)
Get subscriptions status of users to a broadcaster.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | An object containing a broadcaster_id and one or more user_ids. |
| callback | <code>function</code> | The callback function. |

<a name="TwitchApi+getStreams"></a>

### twitchApi.getStreams(options, callback)
Get one or more live streams.

**Kind**: instance method of [<code>TwitchApi</code>](#TwitchApi)

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | A options object used to create the request. |
| callback | <code>function</code> | The function that will be called when execution is finished. |

<a name="TwitchApi+event_refresh"></a>

### "refresh"
Refresh event fired when the access token is refreshed. Listening to this event lets you save new refresh and access tokens as they refresh. The refresh and access token in the existing instance will update automatically.

**Kind**: event emitted by [<code>TwitchApi</code>](#TwitchApi)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| access_token | <code>string</code> | The new access token. |
| refresh_token | <code>string</code> | The new refresh token. Is not always included. |
| expires_in | <code>number</code> | The amount of time in seconds until the access token expires. |
| scope | <code>array</code> \| <code>string</code> | The scopes associated with the access token. |