require("dotenv").config();
const token = process.env.TOKEN;
if(!token) { console.log("Token not found."); process.kill(1); };
const ignoreUser = process.env.IGNORE;
const prefix = "rocket";
const version = "0.1.0";
const colors = { main: "#55ACEE", error: "#A0041E" };

const Discord = require("discord.js");
const client = new Discord.Client();
const ImgAPI = require("imageapi.js");
const Command = require("./command.js");
const Errors = require("./error.js");

const commands = [];

const devs = [];
devs.push({name: "j0code", id: "418109742183874560", role: "Creator & Main Contributor", media: [{name: "GitHub", value: "@j0code"},{name: "Twitter", value: "@j0naslp_yt"}], color: "#8000ff"});
devs.push({name: "cfp", id: "318394797822050315", role: "Creator", media: [{name: "GitHub", value: "@cfpwastaken"},{name: "Twitter", value: "@"}], color: "#e36d6d"]});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
	console.log(msg.guild.name + " #" + msg.channel.name + " " + msg.author.tag + ": " + msg.content);
	if(msg.author.id == ignoreUser) {
		if(msg.content.toLowerCase().startsWith(prefix+" ")) {
			let s = msg.content.substring(7);
			var cmd = commands[8]; // amiignored
			var kw = cmd.keywords;
			for(var j = 0; j < kw.length; j++) {
				if(s.toLowerCase().startsWith(kw[j])) {
					s = s.substring(kw[j].length+1);
					cmd.run(msg, kw[j], s);
					return;
				}
			}
		}
		return;
	}
	let channel = msg.channel;
	if(msg.content.toLowerCase() == "rocket") {
		// change to embed containing bot description and stuff later
		channel.send(embed({description: "Rocket to get doge to the moon\n\nSimple bot you can talk to and that helps you.\nTry `rocket help` or `rocket devs`.", author: {name: "Bot Info"}}));
	} else if(msg.content.toLowerCase().startsWith(prefix+" ")) {
		let s = msg.content.substring(7);
		let o = checkCommand(s);
		if(o.cmd) {
			s = s.substring(o.keyword.length+1);
			console.log("cmd:", o.cmd.name, "keyword:", o.keyword, "s:", s);
			try {
				o.cmd.run(msg, o.keyword, s);
			} catch(e) {
				channel.send(embed({author: {name: e.name}, description: e.description, color: colors.error }));
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
		var kw = cmd.keywords;
		for(var j = 0; j < kw.length; j++) {
			if(s.startsWith(kw[j])) return { cmd: cmd, keyword: kw[j]};
		}
	}
	return {};
}

function embed(options) {
	options = options || {};
	if(!options.footer) options.footer = {};
	if(!options.footer.text) options.footer.text = "Rocket v" + version;
	if(!options.footer.iconURL) options.footer.iconURL = client.user.avatarURL({dynamic: true}); // dynamic gets .gif url if animated
	if(!options.color) options.color = colors.main;
	if(!options.url) options.url = "https://github.com/creelonestudios/rocketbot";
	if(!options.author) options.author = {};
	if(!options.author.name) options.author.name = "Rocket";
	if(!options.author.url) options.author.url = "https://github.com/creelonestudios/rocketbot";
	if(!options.author.iconURL) options.author.iconURL = client.user.avatarURL({dynamic: true}); // dynamic gets .gif url if animated
	return new Discord.MessageEmbed(options);
}

// COMMANDS //
/* 
	commands.push(new Command("name", ["keyword1","keyword2"], "description", "syn <ta> [x]", (msg, keyword, s) => { // run }));
*/

// one line commands
commands.push(new Command("ping", ["ping"], "Pong.", "", msg => { msg.channel.send("pong."); }));
commands.push(new Command("pong", ["pong"], "Uhm...", "", msg => { msg.channel.send("wait. that's my job."); }));
commands.push(new Command("where", ["where","to where","towhere","goes where"], "Where does the Rocket go to?", "", msg => { msg.channel.send(":rocket: To the moon!"); }));
commands.push(new Command("to the moon", ["tothemoon", "to the moon","to moon","tomoon"], "To the moon!", "", msg => { msg.channel.send("Yes. That's right!"); }));
commands.push(new Command("launch", ["launch","start"], "Lauch the Rocket.", "", msg => { msg.channel.send("You don't have permission to launch the Rocket."); }));
commands.push(new Command("invite", ["invite","get"], "Get bot invite.", "", msg => { msg.channel.send(embed({author: {name: "Bot Invite"}, title: "[Click me]", url: "https://discord.com/api/oauth2/authorize?client_id=847180979713212426&permissions=8&scope=bot%20applications.commands"})); }));

// complex commands
commands.push(new Command("help", ["help","hilfe","hilf mir","ich brauche hilfe","ich benötige hilfe","i need help with", "i need help","cmds","cmdlist","cmd list","commands","command list"], "Command List / Info", "[cmd...]", (msg,keyword,s) => {
	if(s.length > 0) {
		let o = checkCommand(s);
		if(o.cmd) {
			s = s.substring(o.keyword.length+1);
			var help = o.cmd.help(msg, o.keyword, s);
			console.log("help:", help);
			if(!help.error) {
				var desc = help.description;
				var fields = [];
				if(help.syntax) desc += "\nSyntax: `" + help.syntax + "`";
				if(help.keywords) desc += "\nKeywords: " + help.keywords.join(", ");
				if(help.subcmds.length > 0) {
					desc += "\nSubcommands:";
					for(var i = 0; i < help.subcmds.length; i++) {
						var cmd = help.subcmds[i];
						var field = {};
						field.name = cmd.name;
						field.value = cmd.description;
						field.inline = true;
						fields.push(field);
					}
				}
				msg.channel.send(embed({author: {name: "Rocket Command Info:" + help.path}, description: desc, fields: fields}));
			} else {
				msg.channel.send(embed({author: {name: "Rocket Command Info:" + help.path}, description: help.description, color: colors.error}));
			}
		} else {
			msg.channel.send("Unknown Command: " + s);
			console.log("s:", s);
		}
	} else {
		var fields = [];
		for(var i = 0; i < commands.length; i++) {
			var cmd = commands[i];
			var field = {};
			field.name = cmd.name;
			field.value = cmd.description;
			field.inline = true;
			fields.push(field);
		}
		msg.channel.send(embed({author: {name: "Rocket Command List"}, description: "This is the command list of Rocket.\nUse `rocket help [command...]` to get more info about a specific command.", fields: fields}));
	}
}));

commands.push(new Command("credits", ["devs","dev","contributors","by","is by","made by","credits","credit"], "Credits", "", msg => {
	for(var i = 0; i < devs.length; i++) {
		let dev = devs[i];
		let user = client.users.cache.get(dev.id);
		let fields = [];
		if(user) fields.push({name: "Discord", value: "<@" + user.id + ">" + " (" + user.tag + ")", inline: true});
		for(var j = 0; j < dev.media.length; j++) {
			let media = dev.media[j];
			fields.push({name: media.name, value: media.value, inline: true});
		}
		msg.channel.send(embed({author: {name: dev.name, iconURL: user.avatarURL({dynamic: true})}, description: dev.role, fields: fields, color: dev.color, thumbnail: {url: user.avatarURL({dynamic: true})}}));
	}
}));


commands.push(new Command("doge", ["doge","dogecoin","shibe","dogeshibe"], "many doge text", "", msg => {
    let texts = ["such doge. wow", "Dogecoin to the moon :rocket:", "To the moon!", "Dogecoin > Bitcoin"];
    let text = texts[Math.floor(Math.random()*(texts.length))];
    msg.channel.send(text);
}));

commands.push(new Command("am i ignored", ["am i ignored","do you ignore me","ignoring me","ignore user"], "Determine whether the bot ignores you. (Dev)", "", msg => { // has to be cmd #8 !!!
	if(msg.author.id == ignoreUser) {
		msg.channel.send("I'm told not to talk y- oh.");
	} else {
		msg.channel.send("No. If I don't answer to you, it's your fault and/or I have a :bug:");
	}
}));

commands.push(new Command("meme", ["memes","meme","fresh memes","fresh meme","reddit","reddit meme","subreddit"], "Fresh Memes", "", async function(msg) {
    let subreddits = ["memes", "amongusmemes", "MemeEconomy", "ComedyCemetery", "dankmemes", "terriblefacebookmemes", "funny"];
    let subreddit = subreddits[Math.floor(Math.random()*(subreddits.length))];
    let img = await ImgAPI(subreddit);

    // need dc embed bcuz image wow
    const memeembed = new Discord.MessageEmbed().setTitle("Fresh meme from r/" + subreddit).setColor("RANDOM").setImage(img);

    msg.channel.send(memeembed);
}));

commands.push(new Command("delete", ["delete", "delete that", "del", "del that", "deletethat", "delthat"], "Deprecated. Please do not use.", "", msg => {
	if(client.user.lastMessage != null) {
		client.user.lastMessage.delete();
		msg.channel.send("Sure");
	} else {
		msg.channel.send("Sry i never sent anything");
	}
}));

commands.push(new Command("say", ["say","write","repeat"], "Rocket repeats what you said", "<msg>", (msg, keyword, s) => {
	if(s.length > 0) {
		msg.channel.send(s);
	} else {
		throw new Errors.MissingArgumentError("msg");
	}
}));

client.login(token);