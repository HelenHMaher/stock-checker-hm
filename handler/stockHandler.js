const MongoClient = require('mongodb').MongoClinet;
const CONNECTION_STRING = process.env.DB;
const axios = require('axios').default;

function StockHandler() {
  
  this.getStock = (symbol, callback) => {
    axios({
      method: 'get',
      url: `https://repeated-alpaca.glitch.me/v1/stock/${symbol}/quote`
    })
    .then(function (response) {
      const stockData = {
        stock: response.data.symbol,
        price: response.data.latestPrice
      }
      console.log(stockData);
      callback('stockData', stockData);
    })
    .catch(function (error) {
      console.log(`error: ${error}`);
      callback('stockData', {error: 'external source error'});
    })
  }
  
  this.addLike = (symbol, like, ip, callback) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('stock-checker');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        console.log('successful database connection');
        
        if(like || like === 'true') {
          db.collection('stock-likes').findOneAndUpdate(
            {stock: symbol.toLowerCase()},
            {$push: {likes: ip}},
            {returnNewDocument: true, upsert: true},
            (err, data) => {
              if(err) console.log(err);
              const likeCount = data.value.likes.length;
              callback('likeData', {
                stock: symbol,
                likes: likeCount
              });
          });
        } else {
          db.collection('stock-likes').find({stock: symbol.toLowerCase()}).toArray((err, data) => {
            if(err) console.log(err);
            let likeCount = 0;
            if(data !== []) {
              likeCount = data[0].likes ? data[0].likes.length : 0;
            }
            callback('likeData', {
              stock: symbol,
              likes: likeCount
            });
          });
        }
      }
    })
  }
  
}

module.exports = StockHandler;
  