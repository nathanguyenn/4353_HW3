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
    const username = req.body.uname;
    const password = req.body.psw;
    for (let user of user_data) {
      if (user.email === username && user.password === password) {
        res.redirect("fuelQuoteForm");
        current_user = { username, password };
        return;
      }
    }
    res.render("index");
  });

  //Route that handles login logic
  app.post("/fuelQuoteForm", (req, res) => {
    console.log("going to fuelquoteform with nodejs - post");
    res.render("fuelQuoteForm");
  });

  app.get("/fuelQuoteForm", (req, res) => {
    console.log("going to fuelquoteform with nodejs - get");
    res.render("fuelQuoteForm");
  });

  app.get("/signup", (req, res) => {
    console.log("going to signup with nodejs - get");
    res.render("signup");
  });

  app.post("/signup", (req, res) => {
    console.log("going to signup with nodejs - post");

    const username = req.body.email;
    const password = req.body.psw;
    current_user = { username, password };
    //UserService.addEntry(username, password);
    //res.render("profile", { username, password });
    let string = encodeURIComponent(username + "|" + password);
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
    res.render("history", { fuel_data });
    //console.log(fuel_data);
  });

  // app.get("/profile", (req, res) => {
  //   console.log("going to profile with nodejs");
  //   res.render("profile");
  //   console.log(req.body.username);
  // });
  app.get("/profile", (req, res) => {
    console.log("going to profile with nodejs - get");

    const passedVariable = req.query.valid;
    if (passedVariable != undefined && passedVariable != null) {
      const data_array = passedVariable.split("|");
      const username = data_array[0];
      const password = data_array[1];
      console.log(`username and password is ${username} and ${password}`);
      res.render("profile", { username, password });
    } else {
      const username = current_user.username;
      const password = current_user.password;
      res.render("profile", { username, password });
    }
  });

  app.post("/profile", (req, res) => {
    console.log("going to profile with nodejs - post");
    let street = req.body.ad1;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let address = `${street} ${city} ${state} ${zip}`;
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    UserService.addEntry(username, password, address, name);
    res.redirect("fuelQuoteForm");
  });
}

//Start your server on a specified port
app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
