var express = require('express');
var app = express();
var mongoose = require('mongoose');         
var morgan = require('morgan');             
var bodyParser = require('body-parser');    


mongoose.connect('mongodb://cradwimb:guest@jello.modulusmongo.net:27017/q8iZidin');

require('./app/seedData.js')();

app.use(express.static(__dirname + "/"));
app.use(morgan('dev'));          
app.use(bodyParser.json());

require('./app/routes.js')(app);


app.listen(8080);
console.log("App listening on port 8080");
