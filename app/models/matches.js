const mongoose = require('mongoose');

const Match = mongoose.model('Match', {
  customer: String,
  categories: Array,
  pickupDate: Date,
  recipient: String,
  distance: String,
});

const query = Match.remove({});
query.exec();


module.exports = Match;