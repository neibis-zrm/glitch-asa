// Response for Uptime Robot
const http = require('http');
http.createServer(function(request, response)
{
	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end('Discord bot is active now \n');
}).listen(3000);

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();
const cron = require('node-cron')
const asa_ch = '712586705189863434'

cron.schedule('0 0 22 * * *', () => {
  const channel = client.channels.cache.get(asa_ch)
  channel.send(asa_message())
})

function asa_message(x = null){
  if (x == null) {
    x = Math.random() * 100;
  }
  // emojisコレクションから"custom_test"という名前のカスタム絵文字を検索
  // "name"は名前を検索する？
  const a_emoji = client.emojis.cache.find(emoji => emoji.name === "a_" );
  const sa_emoji = client.emojis.cache.find(emoji => emoji.name === "sa" );
  const genbaneko_emoji = client.emojis.cache.find(emoji => emoji.name === "genbaneko" );
  const aka_emoji = client.emojis.cache.find(emoji => emoji.name === "CCCP" );
  const smo_emoji = client.emojis.cache.find(emoji => emoji.name === "emoji_21" );
  
  console.log(x);
  if (x <= 30) {
    return 'あさ';
  }
  else if (x <= 60) {
    return `${a_emoji.toString()}${sa_emoji.toString()}`
  }
  else if (x <= 70) {
    return `ASA${sa_emoji.toString()}...`
  }
  else if (x <= 85) {
    return `あさ${genbaneko_emoji.toString()}`
  }
  else if (x <= 95) {
    return `${aka_emoji.toString()}`
  }
  else if (x <= 100) {
    return `あ!${smo_emoji.toString()}`
  }
  else {
    return `あ？ねぇよそんなもん`
  }
}

client.on('ready', message =>
{
  client.user.setPresence({ game: { name: 'あさ' } });
	console.log('bot is ready!');
});

client.on('message', message =>
{
  if(message.author != client.user) {    
    if(message.mentions.users.has(client.user.id))
    {
      message.reply('あさ');
      return;
    }
    if(message.content.startsWith("!asa-test"))
    {
      if (message.content.split(" ")[1] == null) {
        message.channel.send(asa_message())
      }
      else {
        message.channel.send(asa_message(message.content.split(" ")[1]))      
      }
    }
  }
});

if(process.env.DISCORD_BOT_TOKEN == undefined)
{
	console.log('please set ENV: DISCORD_BOT_TOKEN');
	process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );