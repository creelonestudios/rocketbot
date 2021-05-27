require("dotenv").config();
const token = process.env.TOKEN;
const prefix = "rocket";

const Discord = require("discord.js");
const client = new Discord.Client();
const Command = require("./command.js");

const commands = [];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
	console.log(msg.guild.name + " #" + msg.channel.name + " " + msg.author.tag + ": " + msg.content);
	let channel = msg.channel;
	if(msg.content.toLowerCase() == "rocket") {
		// change to embed containing bot description and stuff later
		channel.send("that's me.");
	} else if(msg.content.toLowerCase().startsWith(prefix+" ")) {
		let s = msg.content.substring(7);
		let o = checkCommand(s);
		if(o.cmd) {
			s = s.substring(o.keyword.length+1);
			try {
				o.cmd.run(msg, o.keyword, s);
			} catch(e) {
				// send error msg
			}
		} else {
			channel.send("Unkown command.");
		}
	}
});

function checkCommand(s) {
	s = s.toLowerCase()
	for(var i = 0; i < commands.length; i++) {
		var cmd = commands[i];
		if(s.startsWith(cmd.name)) return { cmd: cmd, keyword: cmd.name};
		var kw = cmd.keywords;
		for(var j = 0; j < kw.length; j++) {
			if(s.startsWith(kw[j])) return { cmd: cmd, keyword: kw[j]};
		}
	}
	return {};
}

commands.push(new Command("ping", [], msg => { msg.channel.send("pong."); }));
commands.push(new Command("pong", [], msg => { msg.channel.send("wait. that's my job."); }));

client.login(token);