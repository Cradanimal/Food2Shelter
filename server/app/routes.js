const Match = require('./models/match.js');

module.exports = function(app) {

  app.get('/api/matches', function(req, res) {
    Match.find(function(err, matches) {
      if (err) {
        res.send(err)
      }
      res.send(matches);
    })
  });
}