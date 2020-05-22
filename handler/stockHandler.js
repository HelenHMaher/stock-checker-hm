const MongoClient = require('mongodb').MongoClient;
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
        stock: response.data.symbol.toUpperCase(),
        price: response.data.latestPrice.toString()
      }
      //console.log(stockData);
      callback('stockData', stockData);
    })
    .catch(function (error) {
      console.log(`error: ${error}`);
      callback('stockData', {error: 'external source error'});
    })
  }
  
  this.getLikes = (symbol, like, ip, callback) => {
    //console.log(like);
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
      const db = client.db('stock-checker');
      if(err) {
        console.log(`Database err: ${err}`);
      } else {
        //console.log('successful database connection');
        
        if(!like || like === "false") {
          db.collection('stock-likes').find({stock: symbol.toLowerCase()}).toArray((err, data) => {
            if(err) { console.log(err);}
            const likeData = {
              stock: symbol.toUpperCase(),
              likes: 0
            }
            if(data.length > 0) {
              likeData.likes = data[0].likes ? data[0].likes.length : 0;
            }
        
            callback('likeData', likeData);
          });
        } else {
          db.collection('stock-likes').findOneAndUpdate(
            {stock: symbol.toLowerCase()},
            {$addToSet: {likes: ip}},
            {new: true, upsert: true},
            (err, data) => {
              if(err) console.log(err);
              const likeCount = data.value.likes.length;
              callback('likeData', {
                stock: symbol.toUpperCase(),
                likes: likeCount
              });
          });
        }
      }
    })
  }
  
}

module.exports = StockHandler;
  