# node-twitch
This package is a wrapper around the Twitch Helix API. It is written in Typescript and provides in-editor documentation for all methods and options. All methods are named after their endpoint names in the [Twitch API Reference](https://dev.twitch.tv/docs/api/reference).

> **NOTE**: This package is still under development. All endpoints are not yet supported. See documentation for all supported endpoints.

## Documentation
To see and read about the methods provided by the package, please visit the [documentation](https://plazide.github.io/node-twitch).

## Installation
The package is available through NPM, which means you can choose to install it using either `npm` or `yarn`

NPM:
```sh
npm install node-twitch
```

Yarn:
```sh
yarn add node-twitch
```

## Usage

To start using the package, you need to import and initialize the API class. You need to provide it with your `client_id` and `client_secret` which you get from creating an application on the [Twitch developers site](https://dev.twitch.tv/console). 

Using Typescript or bundler:
```js
import TwitchApi from "node-twitch";

const twitch = new TwitchApi({
	client_id: "YOUR_CLIENT_ID",
	client_secret: "YOUR_CLIENT_SECRET"
});
```

Using native NodeJS:
```js
const TwitchApi = require("node-twitch").default;

const twitch = new TwitchApi({
	client_id: "YOUR_CLIENT_ID",
	client_secret: "YOUR_CLIENT_SECRET"
});
```

This is the easiest way to get started with the package. Using this configuration, an app access token will be automatically fetched for you which will allow to call all public endpoints. 

### With an authenticated user

If you need to access user data, you'll will have to provide an `access_token` which grants access for a user.

To get this `access_token` you can follow one of the authentication flows on the [Twitch documentation site](https://dev.twitch.tv/docs/authentication/getting-tokens-oauth).

> **NOTE:** It is recommended that you handle the authentication yourself. This package is made for use on the server, and authentication requires you to present a link on the client where users grant your app permissions.

#### Before initialization

If you want, you can handle all of the authentication yourself and simply pass in an `access_token` when creating a new instance of `TwitchApi`. You should also pass in the scopes the `scopes` that are granted for the passed in `access_token`.

```js
import TwitchApi from "node-twitch";

const twitch = new TwitchApi({
  client_id: "YOUR_CLIENT_ID",
  client_secret: "YOUR_CLIENT_SECRET",
  access_token: "USER_ACCESS_TOKEN",
  scopes: ["YOUR_SCOPES"]
});
```

#### After initialization

You can also get user access after creating an instance of `TwitchApi`. There are two important methods to help you with this.

1. **generateAuthUrl**. This method will generate the URL for your users to visit in order to grant permissions to your app. It will use the `client_id`, `client_secret`, and `scopes` passed to the constructor to generate the URL.
2. **getUserAccess**. This method will fetch the refresh and access tokens using the code returned from Twitch after a user visits the auth URL. This requires you to setup proper callback URLs.

Read more about authentication on the [official Twitch documentation](https://dev.twitch.tv/docs/authentication)

### Examples
Here are a few examples of common use cases to get you started. The examples assume that you have created an instance of `TwitchApi` called `twitch`. See [usage](#usage) on how to do this.

#### Getting a single stream

To get the stream information from a single user:
```js
async function getStream(){
  const streams = await twitch.getStreams({ channel: "sacriel" });
  console.log(streams);
}

getStream();
```

Provided that the stream is live, something like this will be logged:
```js
{
  data: [
    {
      id: '39800533772',
      user_id: '23735582',
      user_name: 'Sacriel',
      game_id: '491931',
      type: 'live',
      title: 'Cheeky bit of Tarky, maybe PUBG later?',
      viewer_count: 2013,
      started_at: '2020-10-28T11:40:49Z',
      language: 'en',
      thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_sacriel-{width}x{height}.jpg',
      tag_ids: [Array]
    }
  ],
  pagination: {}
}
```

#### Getting multiple streams

To get stream information of multiple channels:

```js
async function getStreams(){
	const streams = await twitch.getStreams({ channels: ["shroud", "summit1g"] });
	console.log(streams);
}

getStreams();
```

Provided that both streams are live, something like this would be returned:

```js
{
  data: [
    {
      id: '40860684878',
      user_id: '26490481',
      user_name: 'summit1g',
      game_id: '491931',
      game_name: 'Escape From Tarkov',
      type: 'live',
      title: 'big gains today. [ @summit1g ]',
      viewer_count: 23923,
      started_at: '2020-12-07T22:46:40Z',
      language: 'en',
      thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_summit1g-{width}x{height}.jpg',
      tag_ids: [Array]
    },
    {
      id: '40860769838',
      user_id: '37402112',
      user_name: 'shroud',
      game_id: '65632',
      game_name: 'DayZ',
      type: 'live',
      title: 'Namalsk. | Follow @shroud on socials',
      viewer_count: 22813,
      started_at: '2020-12-07T22:53:30Z',
      language: 'en',
      thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_shroud-{width}x{height}.jpg',
      tag_ids: [Array]
    }
  ],
  pagination: {}
}
```

#### Getting thumbnail url from a stream

```js
async function getThumbnailUrl(){
	const result = await twitch.getStreams({ channel: "shroud" });
	const stream = result.data[0];
	console.log(stream.getThumbnailUrl());
}

getThumbnailUrl();
```

Provided that the stream is live, this would be returned:

```
https://static-cdn.jtvnw.net/previews-ttv/live_user_shroud-1920x1080.jpg
```

#### Getting a user's ID
To get the ID of a user:
```js
async function getUserId(loginName){
  const users = await twitch.getUsers(loginName);
  const user = users.data[0];
  const userId = user.id;

  console.log(userId);
}

getUserId("sacriel");
```

This would log:
```
23735582
```

## Problems or issues?

If you encounter any problems, bugs or other issues with the package, please create an [issue in the GitHub repo](https://github.com/Plazide/node-twitch/issues). 

## Get in touch
If you have any questions or just want to reach me, you can get in touch with me on Twitter([@chj_web](https://twitter.com/chj_web))