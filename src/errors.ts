export type TwitchApiRateLimit = {
	// Ratelimit-Limit header
	limit: number;
	// Ratelimit-Remaining header
	remaining: number;
	// Ratelimit-Reset header
	reset: number;
};

export class TwitchApiRateLimitError extends Error {
	statusCode = 429;
	ratelimit: TwitchApiRateLimit;
	constructor(ratelimit: TwitchApiRateLimit){
		super("Too many requests");
		this.ratelimit = ratelimit;
	}
}
