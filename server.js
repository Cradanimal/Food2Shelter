const express = require('express');
const app = express();
const mongoose = require('mongoose');         
const morgan = require('morgan');             
const bodyParser = require('body-parser');    


mongoose.connect(process.env.DATABASE_URL);

require('./app/seedData.js')();

app.use(express.static(__dirname + "/"));
app.use(morgan('dev'));          
app.use(bodyParser.json());

require('./app/routes.js')(app);


app.listen(8080);
console.log("App listening on port 8080");
