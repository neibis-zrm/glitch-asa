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
const cron = require('node-cron');
const schedule = require('node-schedule');
const asa_ch = '712586705189863434';

// database implements
var {Client} = require('pg');
const dbConnectStr = process.env.DATABASE_URL;

// query
const query_select_ch = 'select id, ch_num from channel order by id;'
function query_insert_ch(channel_ID){
  return `insert into channel (ch_num) values (${channel_ID});`
}
function query_delete_ch(channel_ID){
  return `delete from channel where ch_num = (${channel_ID});`
}


var sHour = 22;
var sMin = 0;

// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
	return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

var morning = schedule.scheduleJob(`0 ${sMin} ${sHour} * * *`, function(){
  const channel = client.channels.cache.get(asa_ch)
  // console.log(`${sMin} ${sHour}`)
  channel.send(asa_message())
})

function set_schedule(hour,min){
  try {
    sHour = hour - 9
    if (sHour < 0) {
      sHour += 24
    }
    sMin = min
    morning.reschedule(`0 ${sMin} ${sHour} * * *`)
  } 
  catch (error) {
    console.log("set_schedule error");
    return false;
  }
  return true;
}

function show_schedule(){

  hour = sHour + 9
  if (hour >= 24) {
    hour -= 24
  }
  min = sMin
  return `${zeroPadding(hour,2)}:${zeroPadding(min,2)}`
}

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

// データベース接続(ベース)
function pg_connect(){
  const client = new Client({
    connectionString: dbConnectStr,
    ssl: { rejectUnauthorized: false }
  });
  client.connect(function(err) {
    if (err) {
      return console.error('could not connect to postgres', err);
    }
    else {
      // クエリを実行
    }
  });
}

// タイマー実行ch取得
function select_ch(){

  channels = [];
  const client = new Client({
    connectionString: dbConnectStr,
    ssl: { rejectUnauthorized: false }
  });

  return new Promise(function(resolve,reject){
    client.connect(function(err) {
      if (err) {
        reject(console.error('could not connect to postgres', err));
      }
      else {
        client.query(query_select_ch, function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const num = data.ch_num;
              console.log("id:" + id);
              console.log("name:" + num);
              channels.push(num);
            }
            console.log(channels);
            resolve(channels);
          }
        });
      }
    });
  })
}

// タイマー実行ch確認
function select_ch(channel_ID){

  const client = new Client({
    connectionString: dbConnectStr,
    ssl: { rejectUnauthorized: false }
  });

  return new Promise(function(resolve,reject){
    client.connect(function(err) {
      if (err) {
        reject(console.error('could not connect to postgres', err));
      }
      else {
        // 設定状態を確認
        client.query(query_select_ch, function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const num = data.ch_num;
              console.log("id:" + id);
              console.log("name:" + num);
              if (channel_ID == num) {
                resolve('True');
                return;
              }
            }
            resolve('False');
          }
        });
      }
    });
  })
}

// タイマー実行ch設定
function insert_ch(channel_ID){

  const client = new Client({
    connectionString: dbConnectStr,
    ssl: { rejectUnauthorized: false }
  });

  return new Promise(function(resolve,reject){
    client.connect(function(err) {
      if (err) {
        reject(console.error('could not connect to postgres', err));
      }
      else {
        client.query(query_insert_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(insert_query)', err));
          }
          else {
            console.log(result);
          }
        });
        client.query(query_select_ch, function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(select_query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const num = data.ch_num;
              console.log("id:" + id);
              console.log("name:" + num);
              if (channel_ID == num) {
                resolve('True');
              }
            }
            resolve('False')
          }
        });
      }
    });
  })
}


// タイマー実行ch設定解除
function delete_ch(channel_ID){

  const client = new Client({
    connectionString: dbConnectStr,
    ssl: { rejectUnauthorized: false }
  });

  return new Promise(function(resolve,reject){
    client.connect(function(err) {
      if (err) {
        reject(console.error('could not connect to postgres', err));
      }
      else {
        client.query(query_delete_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(insert_query)', err));
          }
          else {
            console.log(result);
          }
        });
        client.query(query_select_ch, function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(select_query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const num = data.ch_num;
              console.log("id:" + id);
              console.log("name:" + num);
              if (channel_ID == num) {
                resolve('False');
              }
            }
            resolve('True')
          }
        });
      }
    });
  })
}

// botの実行
client.on('ready', message =>
{
  client.user.setPresence({ game: { name: 'あさ' } });
	console.log('bot is ready!');
});

// メッセージアクション
client.on('message', message =>
{
  // リプライによる反復禁止
  if(message.author != client.user) {
    // リプライに反応する 
    if(message.mentions.users.has(client.user.id))
    {
      message.reply('あさ');
      return;
    }
    // メッセージを表示
    if((message.content.startsWith("!asa")) && (message.content.split(" ")[0] == "!asa"))
    {
      if (message.content.split(" ")[1] == null) {
        message.channel.send(asa_message())
      }
      else {
        message.channel.send(asa_message(message.content.split(" ")[1]))      
      }
    }
    // タイマー機能:チャンネル設定
    if(message.content.startsWith("!asa-ch-set"))
    {
      select_ch(message.channel.id).then(function(select){
        console.log(select);
        if (select == "False") {
          insert_ch(message.channel.id).then(function(insert){
            if (insert == "True") {
              message.channel.send('ヨシ！')
            }
            else if(insert == "False") {
              message.channel.send('誰もお前を愛さない')
            }
            else{
              message.channel.send(insert)
            }
          });
        }
        else if(select == "True") {
          message.channel.send('しかしなにもおきなかった…')
        }
        else {
          message.channel.send(select)
        }
      })
    }
    // タイマー機能:チャンネル設定解除
    if(message.content.startsWith("!asa-ch-remove"))
    {
      select_ch(message.channel.id).then(function(select){
        console.log(select);
        if (select == "True") {
          delete_ch(message.channel.id).then(function(del){
            if (del == "True") {
              message.channel.send('ヨシ！')
            }
            else if(del == "False") {
              message.channel.send('誰もお前を愛さない')
            }
            else{
              message.channel.send(del)
            }
          });
        }
        else if(select == "False") {
          message.channel.send('しかしなにもおきなかった…')
        }
        else {
          message.channel.send(select)
        }
      })
    }
    // タイマー機能:時刻設定
    if(message.content.startsWith("!asa-timer") && (message.content.split(" ")[0] == "!asa-timer"))
    {
      if((message.content.split(" ")[1] != null) && (message.content.split(" ")[2] != null)) {
        hour = message.content.split(" ")[1];
        min = message.content.split(" ")[2];
        hour = Number(hour);
        min = Number(min);
        if (Number.isInteger(hour) || Number.isInteger(min)) {
          if ((hour >= 24 ) || ((hour < 0))) {
            message.channel.send("申し訳ないが存在しない時間を設定するのはNG")
            return;
          }
          if ((min >= 60 ) || ((min < 0))) {
            message.channel.send("申し訳ないが存在しない時間を設定するのはNG")
            return;
          } 
          if (set_schedule(hour,min)) {
            message.channel.send("ヨシ！")
          }
          else {
            message.channel.send("おきのどくですが　ぼうけんのしょは　きえてしまいました")
          }
        }
        else{
          message.channel.send("エラーエラーエラー")
          return;
        }
      }
      else {
        message.channel.send("さてはインチだなオメー")
      }
    }
    // タイマー機能:時刻表示
    if(message.content.startsWith("!asa-timer-show") && (message.content.split(" ")[0] == "!asa-timer-show"))
    {
      message.channel.send(`本日のあさは${show_schedule()}です`)
    }
  }
});

if(process.env.DISCORD_BOT_TOKEN == undefined)
{
	console.log('please set ENV: DISCORD_BOT_TOKEN');
	process.exit(0);
}

client.login( process.env.DISCORD_BOT_TOKEN );