const express = require('express');
const app = express();
const mongoose = require('mongoose');         
const morgan = require('morgan');             
const bodyParser = require('body-parser'); 
const path = require('path');   


mongoose.connect(process.env.DATABASE_URL);

require('./app/seed/seedData.js')();

app.use(express.static(path.normalize(`${__dirname}/../client`)));
app.use(morgan('dev'));          
app.use(bodyParser.json());

require('./app/routes.js')(app);


app.listen(8080);
console.log("App listening on port 8080");
