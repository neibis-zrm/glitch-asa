
exports.select_ch_all = select_ch_all
exports.select_ch = select_ch
exports.insert_ch = insert_ch
exports.delete_ch = delete_ch
exports.select_timer_ch = select_timer_ch
exports.select_timer_time = select_timer_time
exports.select_timer = select_timer
exports.insert_timer = insert_timer
exports.delete_timer = delete_timer


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
function query_select_timer_ch(channel_ID){
  return `select * from timer where channel = (${channel_ID}) order by id;`
}
function query_select_timer_timer(set_timer){
  return `select * from timer where set_timer = ('${set_timer}') order by id;`
}
function query_insert_timer(channel_ID,set_timer){
  return `insert into timer (channel,set_timer) values (${channel_ID},'${set_timer}');`
}
function query_delete_timer(channel_ID,set_timer){
  return `delete from timer where channel = (${channel_ID}) and set_timer = ('${set_timer}');`
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
function select_ch_all(){

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

// タイマー確認(chから)
function select_timer_ch(channel_ID){

  timers = [];
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
        client.query(query_select_timer_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const ch = data.channel;
              const set_t = data.set_timer;
              console.log("id:" + id);
              console.log("ch:" + ch);
              console.log("set_t:" + set_t);
              timers.push(set_t);
            }
            console.log(timers);
            resolve(timers);
          }
        });
      }
    });
  })
}

// タイマー確認(timerから)
function select_timer_time(set_timer){

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
        client.query(query_select_timer_timer(set_timer), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const ch = data.channel;
              const set_t = data.set_timer;
              console.log("id:" + id);
              console.log("ch:" + ch);
              console.log("set_t:" + set_t);
              channels.push(ch);
            }
            console.log(channels);
            resolve(channels);
          }
        });
      }
    });
  })
}

// タイマー実行確認
function select_timer(channel_ID,set_timer){

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
        client.query(query_select_timer_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const ch = data.channel;
              const set_t = data.set_timer;
              console.log("id:" + id);
              console.log("ch:" + ch);
              console.log("set_t:" + set_t);
              if (set_timer == set_t) {
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

// タイマー設定
function insert_timer(channel_ID,set_timer){

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
        client.query(query_insert_timer(channel_ID,set_timer), function(err, result) {
          if (err) {
            console.log(query_insert_timer(channel_ID,set_timer))
            reject(console.error('could not connect to postgres(insert_query)', err));
          }
          else {
            console.log(result);
          }
        });
        client.query(query_select_timer_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(select_query)', err));
          }
          else {
            for (const data of result.rows) {
              console.log(set_timer)
              const id = data.id;
              const ch = data.channel;
              const set_t = data.set_timer;
              console.log("id:" + id);
              console.log("ch:" + ch);
              console.log("set_t:" + set_t);
              if (set_timer == set_t) {
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

// タイマー設定解除
function delete_timer(channel_ID,set_timer){

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
        client.query(query_delete_timer(channel_ID,set_timer), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(insert_query)', err));
          }
          else {
            console.log(result);
          }
        });
        client.query(query_select_timer_ch(channel_ID), function(err, result) {
          if (err) {
            reject(console.error('could not connect to postgres(select_query)', err));
          }
          else {
            for (const data of result.rows) {
              const id = data.id;
              const ch = data.channel;
              const set_t = data.set_timer;
              console.log("id:" + id);
              console.log("ch:" + ch);
              console.log("set_t:" + set_t);
              if (set_timer == set_t) {
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