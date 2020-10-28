/** Parse an array with mixed string and number types into a query string. */
export interface FParseMixedParam{
	values: string | number | string[] | number[];
	stringKey: string;
	numericKey: string;
}
