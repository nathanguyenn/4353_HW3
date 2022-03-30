const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");

const fuelQuoteService = require("../services/fuelQuoteService");

const data = [
  {
    user: "user2@gmail.com",
    state_PLACEHOLDER: "TX",
    gallonsRequested: "456",
    internalPricePerGallon: 1.99,
    internalCost: 907.4399999999999,
    profit: 1372.56,
    customerPricePerGallon: 5,
    totalPrice: 2280,
    deliveryDate: "2022-03-19",
    address: "1222 My Fake Address, Rosenberg, TX 77204",
  },
  {
    user: "user@gmail.com",
    state_PLACEHOLDER: "TX",
    gallonsRequested: "123",
    internalPricePerGallon: 1.99,
    internalCost: 244.77,
    profit: 370.23,
    customerPricePerGallon: 5,
    totalPrice: 615,
    deliveryDate: "2022-03-26",
    address: "1234 fry road APT 1456, Fort Worth, TX 77479",
  },
  {
    user: "user@gmail.com",
    state_PLACEHOLDER: "TX",
    gallonsRequested: "45",
    internalPricePerGallon: 1.99,
    internalCost: 89.55,
    profit: 135.45,
    customerPricePerGallon: 5,
    totalPrice: 225,
    deliveryDate: "2022-03-17",
    address: "1234 fry road APT 1456, Fort Worth, TX 77479",
  },
];
const sample = [
  {
    user: "user5@gmail.com",
    gallonsRequested: "45",
    address: "1234 fry road APT 1456, Fort Worth, TX 77479",
    deliveryDate: "2022-03-17",
    expected: [5, 225],
  },
];

describe("fuelQuoteService Tests", () => {
  let FuelQuoteService;
  beforeEach(() => {
    FuelQuoteService = new fuelQuoteService("data/fuelQuotes.json");
  });
  it("fuelQuoteService Constructor", () => {
    const expected = "data/fuelQuotes.json";
    expect(FuelQuoteService.datafile).to.eql(expected);
  });
  it("fuelQuoteService getData", async () => {
    const expected = data;
    const result = await FuelQuoteService.getData();
    expect(result).to.eql(expected);
  });
  it("fuelQuoteService getList", async () => {
    const expected = data;
    const result = await FuelQuoteService.getList();
    expect(result).to.eql(expected);
  });
  sample.forEach(
    ({ user, gallonsRequested, address, deliveryDate, expected }) => {
      it(`${[
        user,
        gallonsRequested,
        address,
        deliveryDate,
      ]} should be ${expected}`, async () => {
        const { customerPricePerGallon, totalPrice } =
          await FuelQuoteService.addEntry(
            user,
            gallonsRequested,
            address,
            deliveryDate
          );
        expect([customerPricePerGallon, totalPrice]).to.eql(expected);
      });
    }
  );
  const result = await FuelQuoteService.getData();
  delete result[0];
});
