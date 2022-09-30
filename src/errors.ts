export type TwitchApiRateLimit = {
	limit: number;
	remaining: number;
	reset: number;
};

export class TwitchApiRateLimitError extends Error {
	ratelimit: TwitchApiRateLimit;

	constructor(ratelimit: TwitchApiRateLimit){
		super("Twitch API rate limit reached");
		this.ratelimit = ratelimit;
	}
}
