var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var {ProductInfoClient} = require('./ProductInfoClient');
var {ProductObjectClient} = require('./ProductObjectClient');

var url = require('url');
/* GET home page. */
router.get('/', function(req, res, next) {
    var ProductObjectClient1 = new ProductObjectClient();
    var accessKeyCode = req.query.key;
    ProductObjectClient1.productObjectTransit(accessKeyCode,"certified");
  //res.render('index', { title: 'Express' });
});                                                                                                                                                                                                                                                                                                           

router.get('/getStateAllObject',function(req, res){
    res.render('productInfoTestUI');
})

//ProductInfoProductInfoProductInfoProductInfoProductInfo
router.post('/sendProductInfoClient', function(req, res) {
    var ProductInfoClient1 = new ProductInfoClient();
    ProductInfoClient1.accept(req);
});
router.post('/showProductInfoClient', function(req, res) {
    var ProductInfoClient1 = new ProductInfoClient();
    ProductInfoClient1.show(req);
});
router.get('/createProductInfo', function(req, res) {
    var ProductInfoClient1 = new ProductInfoClient();
    ProductInfoClient1.productInfoCreate();
});





module.exports = router;
