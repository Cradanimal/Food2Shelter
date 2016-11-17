const Converter = require('csvtojson').Converter;

module.exports = function(){
  const converter = new Converter({});
  converter.fromFile('./Customers.csv',function(err,result){
    if (err) {
      console.log('Error', err);
    } else {
      const converter2 = new Converter({});
      converter2.fromFile('./Recipients.csv', function(err, data) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success');
          require('./findMatches.js')(result, data);
        }
      })
    }
  });
}