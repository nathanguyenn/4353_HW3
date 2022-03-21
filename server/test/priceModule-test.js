const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");

const priceModule = require("../services/priceModule");

const sample = [
  {
    input: 5.0,
    expected: [1.99, 9.95, 5.0, 25.0, 15.05],
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
        internalPricePerGallon,
        internalCost,
        customerPricePerGallon,
        totalPrice,
        profit,
      } = PriceModule.calculate(input);
      const result = [
        internalPricePerGallon,
        internalCost,
        customerPricePerGallon,
        totalPrice,
        profit,
      ];
      expect(result).to.eql(expected);
    });
  });
});
