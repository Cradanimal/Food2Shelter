const mongoose = require('mongoose');

const Match = mongoose.model('Match', {
  customer: String,
  categories: Array,
  matches : Array,
});

const query = Match.remove({});
query.exec();


module.exports = Match;