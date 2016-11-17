const Match = require('./models/matches.js');
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CATEGORIES = ['Raw Meat', 'Dairy', 'Seafood', 'Hot Prepared', 'Cold Prepared', 'Frozen'];
const HOURS = {
    8: 1,
    9: 2,
    10: 4,
    11: 8,
    12: 16,
    13: 32,
    14: 64,
    15: 128,
    16: 256,
    17: 512,
    18: 1024,
    19: 2048,
    20: 4096,
    21: 8192,
    22: 16384,
    23: 32768
  };



module.exports = function(customers, recipients) {
  // we will iterate over the customers and preform a series of checks against recipients
  customers.forEach(function(customer) {
    // shape the record we will store in our database
    const record = {
      'customer': `${customer.FirstName} ${customer.LastName}`,
      'categories': null,
      'matches': []
    };
    // create a date obj out of the customer's pickup info
    const pickupDate = new Date(customer.PickupAt);
    // log what the customer is offering in the record
    record.categories = bitsToCategories(customer.Categories);
    // now we check against all recipients
    if (record.categories.length > 0) {
      recipients.forEach(function(recipient) {
        const matchRecord = {
          'recipient': `${recipient.FirstName} ${recipient.LastName}`,
          'distance': null,
          'accepts': null
        }
        // first we check if a recipient is in bounds (5 miles in this case)
        const distance = calculateDistance(customer.Latitude, customer.Longitude, recipient.Latitude, recipient.Longitude)
        if ( distance <= 5) {
          matchRecord.distance = distance.toFixed(2);
          // then check that the recipient is open at the pickup time
          if (isRecipientOpen(pickupDate, recipient[DAYS[pickupDate.getDay()]])){
            // then determine what goods that the customer has that the recipient will accept
            const alignedGoodsInt = whatRecipientAccepts(customer.Categories, recipient.Restrictions); 
            matchRecord.accepts = bitsToCategories(alignedGoodsInt);
            if (matchRecord.accepts.length > 0) {
              // if the recipient will accept any good that the customer has, add them to the matches array
              record.matches.push(matchRecord);
            }
          }
        }
      });
      // once we have found all matches for a customer add them to the database
      Match.create(record, function(err, doc) {
        if (err) {
          console.log('Error', err);
        } else {
          console.log(doc);
        }
      })
    }
  });
}

// HELPER FUNCTIONS

// function converting a positive interger to binary string
function intToBinary(int){
    return int.toString(2);
};

function toRad(num) {
   return num * Math.PI / 180;
}
// function returning the distance between two points 
function calculateDistance(customerLat,customerLon, recipientLat, recipientLon) {

  const R = 6371; // km 
  //has a problem with the .toRad() method below.
  const x1 = recipientLat-customerLat;
  const dLat = toRad(x1);  
  const x2 = recipientLon-customerLon;
  const dLon = toRad(x2);  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(toRad(customerLat)) * Math.cos(toRad(recipientLat)) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  let d = R * c; 
  // convert to miles
  d /= 1.60934;
  return d 
}

function isRecipientOpen(pickup, hoursOfOperation) {
  // using local hours
  const hour = pickup.getHours(); // 14
  return !!(HOURS[hour] & hoursOfOperation);
}

function whatRecipientAccepts(offered, rejected) {
  return (offered & ~(rejected));
}

function bitsToCategories(int) {
  return CATEGORIES.filter((v, i) => int & 1 << i);
}
