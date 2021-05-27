module.exports = class Command {
	#name; #keywords; #run; #help;
	constructor(name, keywords, run, help) {
		this.#name = name || "";
		this.#keywords = keywords || [];
		this.#run = run || (() => {});
		this.#help = help || (() => {});
	}
	
	get name() {
		return this.#name;
	}
	
	get keywords() {
		return this.#keywords;
	}
	
	get run() {
		return this.#run;
	}
	
	get help() {
		return this.#help;
	}
}