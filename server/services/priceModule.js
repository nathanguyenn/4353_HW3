class priceModule {
  static calculate(gallonsRequested) {
    let customerPricePerGallon = 5.0;
    const internalPricePerGallon = 1.99;
    let internalCost = internalPricePerGallon * gallonsRequested;
    let totalPrice = customerPricePerGallon * gallonsRequested;
    let profit = totalPrice - internalCost;

    let price = {
      internalPricePerGallon: internalPricePerGallon,
      internalCost: internalCost,
      customerPricePerGallon: customerPricePerGallon,
      totalPrice: totalPrice,
      profit: profit,
    };
    return price;
  }
}

module.exports = priceModule;
