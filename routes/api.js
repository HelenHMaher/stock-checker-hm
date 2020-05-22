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

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {
  
  const stockPrices = new StockHandler();

  app.route('/api/stock-prices')
    .get(function (req, res){
      const stock = req.query.stock;
      stockPrices.getStock(stock, () => {0});
    });
    
};
