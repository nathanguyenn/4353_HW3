const request = require("supertest");
const assert = require("assert");
const express = require("express");
const { expect } = require("chai");

const userService = require("../services/userService");

const users = [
  {
    email: "user2@gmail.com",
    name: "CiCi Lu",
    street: "1222 My Fake Address",
    password: "user2",
    city: "Rosenberg",
    state: "TX",
    zip: "77204",
  },
  {
    email: "user@gmail.com",
    name: "Those Edison",
    street: "1234 fry road APT 1456",
    password: "user",
    city: "Fort Worth",
    state: "TX",
    zip: "77479",
  },
];

describe("User Service Tests", () => {
  let UserService;
  beforeEach(() => {
    UserService = new userService("data/users.json");
  });
  it("User Service Constructor", () => {
    const expected = "data/users.json";
    expect(UserService.datafile).to.eql(expected);
  });
  it("User Service getData", async () => {
    const expected = users;
    const result = await UserService.getData();
    expect(result).to.eql(expected);
  });
  it("User Service getList", async () => {
    const expected = users;
    const result = await UserService.getList();
    expect(result).to.eql(expected);
  });

  it("User Service Modify Entry", async () => {
    //find index of current object
    const users = await UserService.getData();
    const index = users.findIndex(
      (element) => element["email"] === "user2@gmail.com"
    );
    UserService.modifyEntry(
      "user2@gmail.com",
      "John",
      "abc",
      "user2",
      "abc",
      "TX",
      "77490"
    );
    const result = await UserService.getData();
    const expected = {
      city: "abc",
      email: "user2@gmail.com",
      name: "John",
      password: "user2",
      state: "TX",
      street: "abc",
      zip: "77490",
    };
    expect(result[index]).to.eql(expected);
    //const index = await FuelQuoteService.getData().find("user2@gmail.com");
  });
  it("User Service Modify Entry", async () => {
    //find index of current object
    const users = await UserService.getData();
    UserService.modifyEntry(
      "user69@gmail.com",
      "John",
      "abc",
      "user2",
      "abc",
      "TX",
      "77490"
    );
    const result = await UserService.getData();
    const expected = {
      city: "abc",
      email: "user69@gmail.com",
      name: "John",
      password: "user2",
      state: "TX",
      street: "abc",
      zip: "77490",
    };
    expect(result[0]).to.eql(expected);
    delete result[0];

    //const index = await Fu  elQuoteService.getData().find("user2@gmail.com");
  });
});
