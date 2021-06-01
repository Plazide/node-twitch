# Changelog for node-twitch

## *0.4.4 - 2021-06-01*

### Fixed
  - Issue where login names that looks like hex numbers (0xdeadbeef) would be treated as ids. Thanks to [@alacroix](https://github.com/alacroix) for reporting the issue in #22 and fixing with PR #23.

---

## *0.4.1 - 2021-01-03*

### Fixed
  - Bug where ids would be treated as login names, thus not returning any users and not throwing any errors. Thanks to [@IXyles](https://github.com/iXyles) for reporting this in issue #14.

---

## *0.4.0 - 2020-12-22*

### Fixed
  - Incorrect type on for `tag_ids` on `Stream` interface

### Added
  - Added startCommercial method

---

## *0.3.0 - 2020-12-08*

### Added
  - Method on stream object to get the thumbnail url with filled in `{width}` and `{height}` values.
  - More examples in README

### Fixed
  - `channels` option on `getStreams()` always returning empty array.

---

## *0.2.0 - 2020-10-28*

### Changed
  - Package has been completely rewritten in Typescript. This is intended to provide a better developer experience.

### Added
  - getAllStreamTags
  - getStreamTags
  - getVidoes
  - getClips
  - getChannelInformation
  - searchChannels
  - searchCategories
  - getExtensionTransactions
  - getCheermotes
  - getStreamKey
  - getBannedUsers
  - createUserFollows
  - deleteUserFollows
  - getStreamMarkers
  - getUserExtenstions
  - getUserActiveExtensions
  - modifyChannelInformation
  - updateUser
  - createClip
  - getModerators
  - getCodeStatus
  - replaceStreamTags

### Removed
  - isApp option. All requests to the Twitch API now require a access token. If an access token isn't provided, an app access token will be fetched automatically, rendering the isApp option useless.
  - customRequest. *Almost every endpoint has been added, which makes the customRequest method redundant*

## *0.1.4 - 2020-02-12*

### Added
 - Changelog
 - getGames method
 - Tests for api and helper methods