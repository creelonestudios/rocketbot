class Error {
	#name; #desc;
	constructor(name, desc) {
		this.#name = name;
		this.#desc = desc;
	}
	
	get name() {
		return this.#name;
	}
	
	get description() {
		return this.#desc;
	}
}

class MissingArgumentError extends Error {
	constructor(argument) {
		super("MissingArgumentError", "Missing Argument: " + argument);
	}
}

module.exports = {
	Error: Error,
	MissingArgumentError: MissingArgumentError
}