/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response is not an object');
          assert.property(res.body, 'stockData');
          assert.equal(res.body.stockData.stock, 'GOOG');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.isString(res.body.stockData.price, 'price is not a string');
          assert.isNumber(res.body.stockData.likes, 'likes is not a number');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'amzn', like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response is not an object');
            assert.property(res.body, 'stockData');
            assert.equal(res.body.stockData.stock, 'AMZN');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.likes, 1);
            assert.isString(res.body.stockData.price, 'price is not a string');
            assert.isNumber(res.body.stockData.likes, 'likes is not a number');
            done();
        })
        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: 'amzn', like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response is not an object');
            assert.property(res.body, 'stockData');
            assert.equal(res.body.stockData.stock, 'AMZN');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.equal(res.body.stockData.likes, 1);
            assert.isString(res.body.stockData.price, 'price is not a string');
            assert.isNumber(res.body.stockData.likes, 'likes is not a number');
            done();
        })
        
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['azfl','amzn']})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response is not an object');
            assert.isArray(res.body.stockData, 'stockData is not an array');
            assert.property(res.body.stockData[0], 'stock');
            assert.property(res.body.stockData[0], 'rel_likes');
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[1], 'stock')
            assert.property(res.body.stockData[1], 'rel_likes')
            done();
        })
        
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: ['azfl','amzn'], like: true})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response is not an object');
            assert.isArray(res.body.stockData, 'stockData is not an array');
            assert.property(res.body.stockData[0], 'stock');
            assert.equal(res.body.stockData[0].rel_likes, 0);
            assert.property(res.body.stockData[0], 'price');
            assert.property(res.body.stockData[1], 'price');
            assert.property(res.body.stockData[1], 'stock')
            assert.equal(res.body.stockData[1].rel_likes, 0)
            done();
        })
        
      });
      
    });
  
  /*suite('DELETE /api/stock-prices => text', function() {
        
      test('delete likes to reset', function(done) {
        chai.request(server)
        .delete('/api/stock-prices')
        .send({stock: ['amzn']})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.text, `like removed from AMZN`)
          done();
        })
      })
  })*/

});
