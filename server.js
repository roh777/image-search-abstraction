// server.js
// where your node app starts

// init project
var express = require('express');
var googleImage = require('google-images');
var app = express();
var mongoose = require('mongoose');

mongoose.connect("mongodb://"+process.env.USER+":"+process.env.PASS+"@ds155160.mlab.com:55160/urlapp");

const SearchTerm = require('./models/searchTerm');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/api/imagesearch/:searchquery", async (req, res)=> {
  const query = Object.assign(req.query, req.params);
  
  const client = new googleImage(process.env.SEARCH_ENG_ID, process.env.API_KEY);
  const options = {
    page : parseInt(query.offset)  || 1,
    safe : "off",
    dominantColor : query.color || "",
  }
  
  const term = new SearchTerm({term : query.searchquery});
  term.save();
  const images = await client.search(query.searchquery, options);
  res.send(images);
  
});

app.get("/api/latest", async (req,res)=> {
  const lastTenTerms = await SearchTerm.find().limit(10).sort({ when : 'desc'}).select('term when');
  res.send(lastTenTerms);
})
 

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
