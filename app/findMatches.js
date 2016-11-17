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
      'pickupDate': customer.PickupAt,
      'categories': 0
    };

    // create a date obj out of the customer's pickup info
    const pickupDate = new Date(customer.PickupAt);
    // now we check against all recipients
    if (customer.Categories) {
      recipients.forEach(function(recipient) {
        record.recipient = `${recipient.FirstName} ${recipient.LastName}`;
        // determine what goods that the customer has that the recipient will accept
        const alignedGoodsInt = whatRecipientAccepts(customer.Categories, recipient.Restrictions);
        if (alignedGoodsInt) {    
          // then check that the recipient is open at the pickup time
          if (isRecipientOpen(pickupDate, recipient[DAYS[pickupDate.getDay()]])){  
            // check if a recipient is in bounds (5 miles in this case)
            const distance = distanceInMiles(customer, recipient) 
            if (distance <= 5) {
              record.distance = distance.toFixed(2);
              record.categories = bitsToCategories(alignedGoodsInt);
              // if the recipient will accept any good that the customer has, add them to the matches array
              Match.create(record, function(err, doc) {
                if (err) {
                  console.log('Error', err);
                } else {
                  console.log(doc);
                }
              });
            }
          }
        }
      });
    }
  });
}

// HELPER FUNCTIONS

// function converting a positive interger to binary string
function intToBinary(int){
    return int.toString(2);
};

function toRadCoords({ Latitude, Longitude }) {
  return [Latitude, Longitude].map(toRad);
}

function toRad(num) {
   return num * Math.PI / 180;
}

const R = 6371; // Earth Radius km
const KM_PER_MILE = 1.60934;

function distanceInMiles(customer, recipient) {
  const [cLat, cLon] = toRadCoords(customer);
  const [rLat, rLon] = toRadCoords(recipient);

  const dLat = rLat - cLat;
  const dLon = rLon - cLon;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(cLat) * Math.cos(rLat) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c / KM_PER_MILE;
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
