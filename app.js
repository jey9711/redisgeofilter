const express = require('express');
const pug = require('pug');
const redis = require('redis');
const bodyParser = require('body-parser');

// Create Redis client
const client = redis.createClient();

client.on('connect', function() {
  console.log("Connected to Redis...")
});

// Set port
const port = 3000;

// Init app
const app = express();

// Associate Pug with res.render()
app.set('view engine', 'pug');

// Home
app.get('/', function(req, res) {
  res.render('index', {
    pageTitle: 'Bubble Tea Finder'
  });
});

app.post('/', bodyParser.urlencoded({ extended: false }), function(req, res, next) {
  var lat = req.body.latitude, 
      lon = req.body.longitude;

  console.log(`FETCHING BUBBLE TEAS AT LOCATION ${lat}, ${lon}`);
  client.georadius(
    'toronto-bubbletea', 
    lon, 
    lat, 
    '100', 
    'mi', 
    'WITHCOORD', 
    'WITHDIST', 
    'ASC'), function(err, reply) {
      if (err) {
        next(err);
      } else {
        results = reply.map(function(r) {
          return {
            key: r[0],
            distance: r[1],
            longitude: r[2][0],
            latitude: res[2][1]
          };
        });

        res.render('index', {
          pageTitle: 'Bubble Teas Around',
          latitude: lat,
          longitude: lon,
          results: []
        });
      }
    }
  
});

app.listen(port, function() {
  console.log("Running on port "+port);
});