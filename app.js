require('dotenv').config()

const express = require('express'),
      unirest = require('unirest'),
      pry = require('pryjs'),
      shopifyAPI = require('shopify-node-api'),
      crypto = require('crypto'),
      low = require('lowdb'),
      fileAsync = require('lowdb/lib/storages/file-async'),
      bodyParser = require('body-parser');

const app = express();

const API_KEY = process.env.API_KEY,
      API_SECRET = process.env.API_SECRET,
      APP_URL = process.env.APP_URL,
      APP_REDIRECT_URI = process.env.APP_REDIRECT_URI;

app.use(bodyParser.json());
app.use(express.static('public'))

app.set('port', process.env.PORT || 4567);

const db = low('db.json', {
  storage: fileAsync
});

// Set defaults in local JSON db
db.defaults({ tokens: [] })
  .write();

const tokens = db.get('tokens');

const config = {
  shop: 'liddle',
  shopify_api_key: API_KEY, // Your API key
  shopify_shared_secret: API_SECRET, // Your Shared Secret
  shopify_scope: 'write_products,write_orders',
  redirect_uri: APP_REDIRECT_URI
}
config.nonce = nonce()

const Shopify = new shopifyAPI(config); // Initialize Shopify API

const auth_url = Shopify.buildAuthURL();

app.get('/', function(req,res) {
  "Hey there."
  console.log("umm")
});

app.get('/install', function(req,res) {
  res.redirect(auth_url);
});

app.get('/auth/shopify/callback', function(req,res) {
  if (tokens.value().length < 1) {
    const Shopify = new shopifyAPI(config), query_params = req.query;
    // Shopify API module utilizes the is_valid_signature function to verify that requests coming from shopify are authentic.
    Shopify.exchange_temporary_token(query_params, function(err, data){
      if (err) throw err;
      storeToken(req.query.shop.split('.')[0],data['access_token']).then(function(result) {
        createOrderWebhook()
        res.redirect('/')
      })
    });
  } else {
    res.redirect('/');
  }
});

app.post('/neworders', function(req,res) {
  eval(pry.it)
  Shopify.is_valid_signature(req.query_params);
  res.sendStatus(200)
})

function storeToken(shop,access_token) {
  return new Promise(function (resolve, reject) {
    tokens.push({
      shopName: shop,
      accessToken: access_token,
    }).write()
    resolve(console.log("Done!"))
  })
}

function nonce() {
  return crypto.randomBytes(16).toString('hex');
}

function createOrderWebhook() {
  unirest.post('https://liddle.myshopify.com/admin/webhooks.json')
    .headers({'Content-Type': 'application/json','X-Shopify-Access-Token': tokens.last().value().accessToken})
    .send({
      "webhook": {
        "topic": "order/create",
        "address": "https://" + APP_URL + "/neworder",
        "format": "json"
      }
    })
    .end(function (response) {
      console.log(response)
    });
}

app.use(function(req,res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - You lost?');
});

app.use(function(err,req,res,next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - There is something seriously wrong here.');
});

app.listen(app.get('port'), function() {
  console.log('Expres started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});
