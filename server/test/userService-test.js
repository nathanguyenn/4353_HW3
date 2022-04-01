const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");
const util = require("util");
const db = require("../services/database");
db.query = util.promisify(db.query);

const userService = require("../services/userService");

describe("User Service Tests", () => {
  let UserService;
  beforeEach(() => {
    UserService = new userService();
  });

  it("User Service Modify Entry", async () => {
    UserService.modifyEntry(
      "user2@gmail.com",
      "John",
      "NEW ST",
      "user2",
      "houston",
      "TX",
      "77490"
    );
    const expected = {
      city: "houston",
      email: "user2@gmail.com",
      name: "John",
      state: "TX",
      street: "NEW ST",
      zip: 77490,
    };

    db.query(
      "SELECT * FROM customer_info WHERE username = ?",
      "user2@gmail.com",
      function (err, res) {
        const result = {
          city: res[0].city,
          email: res[0].username,
          name: res[0].name,
          state: res[0].state,
          street: res[0].street,
          zip: res[0].zip,
        };
        expect(result).to.eql(expected);
      }
    );
  });
});
