module.exports = {
	/* roots: ["<rootDir>"], */
	transform: {
		"^.+\\.tsx?$": "ts-jest"
	},
	testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(tsx?|jsx?)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
