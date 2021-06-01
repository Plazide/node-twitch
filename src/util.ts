import fs from "fs";
import { FParseMixedParam } from "./types/functions";
import { Stream } from "./types/objects";
const userFile = "./data/apiUser.json";

export function getLocalAccessToken(): string{
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.access_token;
}

export function getLocalRefreshToken(): string{
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.refresh_token;
}

export function getLocalClientId(): string{
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.client_id;
}

export function getLocalClientSecret(): string{
	const data = JSON.parse(fs.readFileSync(userFile, "utf8"));

	return data.client_secret;
}

/**
 * Parses an object into a query string. If the value of a property is an array, that array will be parsed with the `parseArrayToQueryString` function. If a value is undefined or null, it will be skipped.
 * @param {Object} options - The options to parse.
 */
export function parseOptions<T>(options: T): string{
	let query = "";

	for(const key in options){
		const value = options[key];

		if(value === null || value === undefined)
			continue;

		if(Array.isArray(value))
			query += parseArrayToQueryString(key, value);
		else
			query += `${key}=${value}&`;
	}

	return query.replace(/&$/, "");
}

export function parseMixedParam({ values, stringKey, numericKey }: FParseMixedParam): string{
	let query = "";

	function addToQuery(value: string | number): void{
		const key = !isNumber(value) ? stringKey : numericKey;

		query += `${key}=${value}&`;
	}

	if(Array.isArray(values))
		values.forEach(addToQuery);
	else
		addToQuery(values);

	return query.replace(/&$/, "");
}

/**
 * Parse an array into a query string where every value has the same key.
 * @param {string} key - The key to use. This will be repeated in the query for every value in the array
 * @param {string[]|string} arr - Array of values to parse into query string.
 */
export function parseArrayToQueryString(key: string, arr: readonly unknown[]): string{
	const list = Array.isArray(arr) ? arr : [arr];
	const result = list.map( value => `${key}=${value}`).join("&");

	return result;
}

/** Check if a string represents a number */
export function isNumber(value: unknown): boolean{
	if(typeof value === "undefined") return false;
	if(value === null) return false;
	if(("" + value).includes("x")) return false;

	return!isNaN(Number("" + value));
}

export function addThumbnailMethod(stream: Stream): Stream{
	const thumbnailUrl = stream.thumbnail_url;
	stream.getThumbnailUrl = (options: { width: number, height: number } = { width: 1920, height: 1080 }) => {
		const{ width, height } = options;
		return thumbnailUrl.replace("{width}", "" + width).replace("{height}", "" + height);
	};

	return stream;
}
