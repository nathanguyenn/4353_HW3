const fs = require("fs");
const util = require("util");
const priceModule = require("./priceModule");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const db = require("./database");
db.query = util.promisify(db.query);

class fuelQuoteService {
  async addEntry(
    hist_factor,
    in_state,
    user,
    gallonsRequested,
    address,
    deliveryDate
  ) {
    const pricing = priceModule.calculate(
      gallonsRequested,
      in_state,
      hist_factor
    );

    let internalPricePerGallon = pricing.internalPricePerGallon;
    let profit = pricing.profit;
    let customerPricePerGallon = pricing.customerPricePerGallon;
    let totalPrice = pricing.totalPrice;

    var sql =
      "INSERT INTO fuelQuotes (user, gallons_requested, internal_price_per_gallon, profit, customer_price_per_gallon, total_price, delivery_date, address) VALUES (?)";
    var info = [
      user,
      gallonsRequested,
      internalPricePerGallon,
      profit,
      customerPricePerGallon,
      totalPrice,
      deliveryDate,
      address,
    ];
    db.query(sql, [info], function (err, result) {
      if (err) throw err;
    });

    let obj = {
      customerPricePerGallon: customerPricePerGallon,
      totalPrice: totalPrice,
    };
    return obj;
  }
}

module.exports = fuelQuoteService;
