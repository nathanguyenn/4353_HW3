const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./client"));

const userService = require("./services/userService");
const fuelQuoteService = require("./services/fuelQuoteService");

const UserService = new userService("./data/users.json");
const FuelQuoteService = new fuelQuoteService("./data/fuelQuotes.json");

let current_user = "";

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());
app.use(express.static(path.join(__dirname, "./client")));
// check if server works
{
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.post("/", async (req, res) => {
    //res.sendFile(path.join(__dirname, "../client/index.html"));
    const user_data = await UserService.getList();
    const email = req.body.uname;
    const password = req.body.psw;
    for (let user of user_data) {
      if (user.email === email && user.password === password) {
        current_user = user;
        res.redirect("fuelQuoteForm");
        return;
      }
    }
    res.render("index");
  });

  //Route that handles login logic
  app.post("/fuelQuoteForm", (req, res) => {
    console.log("going to fuelquoteform with nodejs - post");
    const gallonsRequested = req.body.galReq;
    const address = req.body.delivAdd;
    const deliveryDate = req.body.delivDate;
    FuelQuoteService.addEntry(
      current_user.email,
      gallonsRequested,
      address,
      deliveryDate
    );
    //res.render("fuelQuoteForm");
    res.redirect("history");
  });

  app.get("/fuelQuoteForm", (req, res) => {
    console.log("going to fuelquoteform with nodejs - get");
    console.log(
      "current user email is - " +
        current_user.email +
        " and address is " +
        current_user.address
    );
    res.render("fuelQuoteForm", { current_user });
  });

  app.get("/signup", (req, res) => {
    console.log("going to signup with nodejs - get");
    res.render("signup");
  });

  app.post("/signup", (req, res) => {
    console.log("going to signup with nodejs - post");

    const email = req.body.email;
    const password = req.body.psw;
    //current_user = { email, password };
    let string = encodeURIComponent(email + "|" + password);
    res.redirect("profile?valid=" + string);
  });

  app.post("/history", async (req, res) => {
    console.log("going to history with nodejs - post");
    const fuel_data = await FuelQuoteService.getList();
    res.render("history", { fuel_data });
  });

  app.get("/history", async (req, res) => {
    console.log("going to history with nodejs - get");
    const fuel_data = await FuelQuoteService.getList();
    const fuel_data_user = [];
    for (let quote of fuel_data) {
      if (quote.user === current_user.email) {
        fuel_data_user.push(quote);
      }
    }
    res.render("history", { fuel_data_user });
  });

  app.get("/profile", (req, res) => {
    console.log("going to profile with nodejs - get");

    const passedVariable = req.query.valid;
    if (passedVariable != undefined && passedVariable != null) {
      const data_array = passedVariable.split("|");
      const email = data_array[0];
      const password = data_array[1];
      console.log(`username and password is ${email} and ${password}`);
      let name = "";
      let street = "";
      let city = "";
      let state = "";
      let zip = "";
      res.render("profile", {
        email,
        password,
        name,
        street,
        state,
        city,
        zip,
      });
    } else {
      const email = current_user.email;
      const password = current_user.password;
      let name = current_user.name;
      let address = current_user.address.split(" ");
      let street = address[0] + " " + address[1];
      let city = address[2];
      let state = address[3];
      let zip = address[4];
      res.render("profile", {
        email,
        password,
        name,
        street,
        state,
        city,
        zip,
      });
    }
  });

  app.post("/profile", async (req, res) => {
    console.log("going to profile with nodejs - post");
    let street = req.body.ad1;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let address = `${street} ${city} ${state} ${zip}`;
    let name = req.body.name;
    let email = req.body.username;
    let password = req.body.password;

    console.log(`concatenated address is ${address}`);

    await UserService.addEntry(email, password, address, name);
    let user_data = await UserService.getList();
    for (let user of user_data) {
      if (user.email === email) {
        console.log(
          `matching email, from the queue, address is - ${user.address}`
        );
        current_user = user;
      }
    }
    console.log(
      `inside profile post method, current_user pw is ${current_user.password}`
    );
    res.redirect("fuelQuoteForm");
  });
}

//Start your server on a specified port
app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
