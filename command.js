module.exports = class Command {
	#name; #keywords; #desc; #syntax; #run; #subcmds;
	constructor(name, keywords, desc, syntax, run) {
		this.#name = name || "unnamed command";
		this.#keywords = keywords || [];
		this.#desc = desc || "No description provided.";
		this.#syntax = syntax || "";
		this.#run = run || (() => {});
		this.#subcmds = [];
	}
	
	static getArgs(s) {
		s.split(" ");
	}
	
	get name() {
		return this.#name;
	}
	
	get keywords() {
		return this.#keywords;
	}
	
	get description() {
		return this.#desc;
	}
	
	run(msg, keyword, s) {
		var o = checkCommand(s, this.#subcmds);
		if(o.cmd) {
			s = s.substring(o.keyword.length+1);
			try {
				o.cmd.run(msg, o.keyword, s);
			} catch(e) {
				// send error msg
			}
		} else {
			this.#run(msg, keyword, s);
		}
	}
	
	help(msg, keyword, s, path) {
		console.log(this.#name, "help", keyword, s);
		path = path || "";
		if(s.length > 0) {
			var o = checkCommand(s, this.#subcmds);
			if(o.cmd) {
				s = s.substring(o.keyword.length+1);
				return o.cmd.help(msg, o.keyword, s, path + " " + this.#name);
			} else {
				return {description: "Unknown subcommand: " + s, path: path + " " + this.#name, error: true};
			}
		} else {
			return {syntax: this.#syntax, subcmds: this.#subcmds, description: this.#desc, keywords: this.#keywords, path: path + " " + this.#name, error: false};
		}
		return {};
	}
	
	addSubcmd(subcmd) {
		if(subcmd instanceof Command) {
			this.#subcmds.push(subcmd);
		}
	}
}

function checkCommand(s, commands) {
	s = s.toLowerCase()
	for(var i = 0; i < commands.length; i++) {
		var cmd = commands[i];
		var kw = cmd.keywords;
		for(var j = 0; j < kw.length; j++) {
			if(s.startsWith(kw[j])) return { cmd: cmd, keyword: kw[j]};
		}
	}
	return {};
}