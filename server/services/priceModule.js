class priceModule {
  static calculate(gallonsRequested, in_state = false, history = false) {
    const company_profit = 0.1;
    const internalPricePerGallon = 1.5;
    let gallon_factor = gallonsRequested > 1000 ? 0.02 : 0.03;
    let history_factor = history ? 0.01 : 0;
    let location_factor = in_state ? 0.02 : 0.04;

    let margin =
      internalPricePerGallon *
      (location_factor - history_factor + gallon_factor + company_profit);

    let customerPricePerGallon = internalPricePerGallon + margin;

    let totalPrice = customerPricePerGallon * gallonsRequested;

    let price = {
      internalPricePerGallon: internalPricePerGallon,
      customerPricePerGallon: customerPricePerGallon,
      totalPrice: totalPrice,
    };
    return price;
  }
}

module.exports = priceModule;
