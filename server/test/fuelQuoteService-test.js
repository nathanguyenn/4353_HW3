const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");

const fuelQuoteService = require("../services/fuelQuoteService");

const sample = [
  {
    hist_factor: false,
    in_state: true,
    user: "user5@gmail.com",
    gallonsRequested: "45",
    address: "1234 fry road APT 1456, Fort Worth, TX 77479",
    deliveryDate: "2022-03-17",
    expected: [1.725, 77.625],
  },
];

describe("fuelQuoteService Tests", () => {
  let FuelQuoteService;
  beforeEach(() => {
    FuelQuoteService = new fuelQuoteService();
  });
  // it("fuelQuoteService Constructor", () => {
  //   const expected = "data/fuelQuotes.json";
  //   expect(FuelQuoteService.datafile).to.eql(expected);
  // });
  // it("fuelQuoteService getData", async () => {
  //   const expected = data;
  //   const result = await FuelQuoteService.getData();
  //   expect(result).to.eql(expected);
  // });
  // it("fuelQuoteService getList", async () => {
  //   const expected = data;
  //   const result = await FuelQuoteService.getList();
  //   expect(result).to.eql(expected);
  // });
  sample.forEach(
    ({
      hist_factor,
      in_state,
      user,
      gallonsRequested,
      address,
      deliveryDate,
      expected,
    }) => {
      it(`${[
        hist_factor,
        in_state,
        user,
        gallonsRequested,
        address,
        deliveryDate,
      ]} should be ${expected}`, async () => {
        const { customerPricePerGallon, totalPrice } =
          await FuelQuoteService.addEntry(
            hist_factor,
            in_state,
            user,
            gallonsRequested,
            address,
            deliveryDate
          );
        expect([customerPricePerGallon, totalPrice]).to.eql(expected);
      });
    }
  );
  //const result = await FuelQuoteService.getData();
  //delete result[0];
});
