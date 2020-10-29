
exports.pg_connect = pg_connect
exports.select_ch_all = select_ch_all
exports.select_ch = select_ch
exports.insert_ch = insert_ch
exports.delete_ch = delete_ch


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