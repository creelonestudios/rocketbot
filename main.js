require("dotenv").config();
const token = process.env.TOKEN;
const ignoreUser = process.env.IGNORE;
const prefix = "rocket";
const version = "0.1.0";

const Discord = require("discord.js");
const client = new Discord.Client();
const Command = require("./command.js");

const commands = [];

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
	console.log(msg.guild.name + " #" + msg.channel.name + " " + msg.author.tag + ": " + msg.content);
	if(msg.author.id == ignoreUser) {
		if(msg.content.toLowerCase().startsWith(prefix+" ")) {
			let s = msg.content.substring(7);
			var cmd = commands[8]; // amiignored
			if(s.startsWith(cmd.name)) {
				s = s.substring(cmd.name.length+1);
				cmd.run(msg, cmd.name, s);
				return;
			}
			var kw = cmd.keywords;
			for(var j = 0; j < kw.length; j++) {
				if(s.startsWith(kw[j])) {
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

function embed(options) {
	if(!options.footer) options.footer = {};
	if(!options.footer.text) options.footer.text = "Rocket v" + version;
	if(!options.footer.iconURL) options.footer.iconURL = client.user.avatarURL({dynamic: true}); // dynamic gets .gif url if animated
	if(!options.color) options.color = "#55ACEE";
	if(!options.url) options.url = "https://github.com/creelonestudios/rocketbot";
	if(!options.author) options.author = {};
	if(!options.author.name) options.author.name = "Rocket";
	if(!options.author.url) options.author.url = "https://github.com/creelonestudios/rocketbot";
	if(!options.author.iconURL) options.author.iconURL = client.user.avatarURL({dynamic: true}); // dynamic gets .gif url if animated
	return new Discord.MessageEmbed(options);
}

commands.push(new Command("ping", [], msg => { msg.channel.send("pong."); }));
commands.push(new Command("pong", [], msg => { msg.channel.send("wait. that's my job."); }));
commands.push(new Command("where", ["to where","towhere"], msg => { msg.channel.send(":rocket: To the moon!"); }));
commands.push(new Command("tothemoon", ["to the moon","to moon","tomoon"], msg => { msg.channel.send("Yes. That's right!"); }));
commands.push(new Command("doge", ["dogecoin","shibe","dogeshibe"], msg => {
    let texts = ["such doge. wow", "Dogecoin to the moon :rocket:", "To the moon!", "Dogecoin > Bitcoin", "Bring em to the moon", "Also try Server System!"];
    let text = texts[Math.floor(Math.random()*(texts.length))];
    msg.channel.send(text);
})); // make this random. Can do
commands.push(new Command("help", ["hilfe","i need help"], msg => { msg.channel.send("insert help text here"); }));
commands.push(new Command("devs", ["dev","contributors","by","is by","credit"], msg => { msg.channel.send("insert credits here"); }));
commands.push(new Command("launch", ["start"], msg => { msg.channel.send("You don't have permission to launch the Rocket."); }));
commands.push(new Command("delete", ["delete that", "del", "del that", "deletethat", "delthat"], msg => {
    console.log("COOP WITH ME");
    if(true) {
        if(client.user.lastMessage != null) {
            client.user.lastMessage.delete();
            msg.channel.send("Sure");
        } else {
            msg.channel.send("Sry i never sent anything");
        }
    }
    else;
commands.push(new Command("amiignored", ["am i ignored","do you ignore me","ignoring me","ignore user"], msg => {
	if(msg.author.id == ignoreUser) {
		msg.channel.send("I'm told not to talk y- oh.");
	} else {
		msg.channel.send("No. If I don't answer to you, it's your fault and/or I have a :bug:");
	}
}));

client.login(token);