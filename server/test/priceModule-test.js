const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");

const priceModule = require("../services/priceModule");

const sample = [
  {
    input: 1500.0,
    expected: [2250.0, 1500.0, 1.5, 1.74, 2610],
  },
];

describe("Price Module Tests", function () {
  let PriceModule;
  beforeEach(() => {
    PriceModule = new priceModule();
  });
  sample.forEach(({ input, expected }) => {
    it(`${input} should be ${expected}`, function () {
      const {
        profit,
        gallonsRequested,
        internalPricePerGallon,
        customerPricePerGallon,
        totalPrice,
      } = priceModule.calculate(input, false, false);
      const result = [
        profit,
        gallonsRequested,
        internalPricePerGallon,
        customerPricePerGallon,
        totalPrice,
      ];
      console.log("testing result" + result);
      expect(result).to.eql(expected);
    });
  });
});
