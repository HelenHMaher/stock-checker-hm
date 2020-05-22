/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const MongoClient = require('mongodb');
const StockHandler = require('../handler/stockHandler.js');

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  
  const stockPrices = new StockHandler();

  app.route('/api/stock-prices')
    .get(function (req, res){
      const symbol = req.query.stock;
      const ip = req.connection.remoteAddress;
      const like = req.query.like || false;
    
      const stockData = [];
      const likeData = [];
    
      const callback = (objName, object) => {
        if(objName === 'stockData') {
          stockData.push(object);
          console.log(stockData);
        }
        if(objName === 'likeData') {
          likeData.push(object);
          console.log(likeData);
          stockData[0].likes = likeData[0].likes;
          if (stockData.length === 1) {
            res.json({stockData: stockData[0]});
          }
          if(likeData.length > 1) {
            delete stockData[0].likes;
            stockData[0].rel_likes = likeData[0].likes - likeData[1].likes;
            stockData[1].rel_likes = likeData[1].likes - likeData[0].likes;
            res.json({stockData: stockData});
          }                          
        }
      };
    
      if(Array.isArray(symbol)) {
        stockPrices.getStock(symbol[0], callback);
        stockPrices.getStock(symbol[1], callback);
        stockPrices.getLikes(symbol[0], like, ip, callback);
        stockPrices.getLikes(symbol[1], like, ip, callback);
      } else {
        stockPrices.getStock(symbol, callback);
        stockPrices.getLikes(symbol, like, ip, callback);
      }
    });
    
};
