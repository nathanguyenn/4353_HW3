const fs = require("fs");
const util = require("util");
const priceModule = require("./priceModule");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const db = require("./database");
db.query = util.promisify(db.query);

class fuelQuoteService {
  constructor(datafile) {
    this.datafile = datafile;
  }
  /**
   * Get all feedback items
   */
  async getList() {
    const data = await this.getData();
    return data;
  }
  /**
   * Fetches feedback data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, "utf8");
    if (!data) return [];
    return JSON.parse(data);
  }

  async addEntry(user, gallonsRequested, address, deliveryDate) {
    const state_PLACEHOLDER = "TX";
    const pricing = priceModule.calculate(gallonsRequested);

    let internalPricePerGallon = pricing.internalPricePerGallon;
    let internalCost = pricing.internalCost;
    let profit = pricing.profit;
    let customerPricePerGallon = pricing.customerPricePerGallon;
    let totalPrice = pricing.totalPrice;

    var sql =
      "INSERT INTO fuelQuotes (user, gallons_requested, internal_price_per_gallon, internal_cost, profit, customer_price_per_gallon, total_price, delivery_date, address) VALUES (?)";
    var info = [
      user,
      gallonsRequested,
      internalPricePerGallon,
      internalCost,
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
