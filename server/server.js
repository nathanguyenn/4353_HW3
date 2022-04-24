const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = 3000;
const path = require("path");
const db = require("./services/database");
const util = require("util");
const bcrypt = require("bcrypt");
const saltRounds = 10;
// NOTE: everytime you want to do a SQL querie,
// do db.query, example are shown in database.js
// and by the line app.get('/' ___) file
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./client"));

const userService = require("./services/userService");
const fuelQuoteService = require("./services/fuelQuoteService");
const { render } = require("ejs");
const priceModule = require("./services/priceModule");

const UserService = new userService("./data/users.json");
const FuelQuoteService = new fuelQuoteService("./data/fuelQuotes.json");
db.query = util.promisify(db.query);
let hist_factor = false;
let current_user = "";
{
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      // to support URL-encoded bodies
      extended: true,
    })
  );
  app.use(cors());
  app.use(express.static(path.join(__dirname, "./client")));
}

History_User = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM fuelQuotes WHERE user = ? ",
      [email],
      (error, elements) => {
        if (error) {
          throw error;
        }
        //console.log(elements);
        return resolve(elements);
      }
    );
  });
};

// check if server works
{
  app.get("/", async (req, res) => {
    // db.query("SELECT * FROM fuelQuotes", function (err, result) {
    //   if (err) throw err;
    //   console.log(result[0].user);
    // });
    try {
      //const resultElements = await SelectAllElements();
      //console.log(resultElements);
      res.render("index");
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/", async (req, res) => {
    const email = req.body.uname;
    const password = req.body.psw;
    let login_email = "";
    let string = encodeURIComponent(email + "|" + password);
    db.query(
      "SELECT * FROM customers WHERE email = ?",
      email,
      async (err, result) => {
        console.log("IN FUNCTION LINE 80");
        if (err) {
          res.render("index", {
            message: "Username or Password is incorrect. Please try again.",
          });
        }
        if (
          result == "" ||
          !(await bcrypt.compare(password, result[0].password))
        ) {
          res.render("index", {
            message: "Username or Password is incorrect. Please try again.",
          });
        } else {
          console.log("IN ELSE LINE 107");
          login_email = email;
          db.query(
            "SELECT * FROM customer_info WHERE username = ?",
            login_email,
            function (err, result) {
              console.log("IN FUNCTION LINE 88");
              if (err) {
                console.log("IN ERR LINE 90");
                res.render("index");
              } else {
                try {
                  if (result) {
                    console.log("IN RESULT LINE 93");
                    in_state = result[0].state == "TX" ? true : false;
                    current_user = {
                      email: result[0].username,
                      name: result[0].name,
                      street: result[0].street,
                      city: result[0].city,
                      state: result[0].state,
                      zip: result[0].zip,
                      in_state: in_state,
                    };
                    res.redirect("fuelQuoteForm");
                  } else {
                    console.log("IN ELSE LINE 103");
                    console.log("result not found");
                  }
                } catch (error) {
                  console.log("In Catch of Try-Catch");
                  res.redirect("profile?valid=" + string);
                }
              }
            }
          );
        }
      }
    );
  });

  app.post("/fuelQuoteForm", async (req, res) => {
    if (req.body.getPrice) {
      console.log("INSIDE GET PRICE, hist_factor is " + hist_factor);
      const gallonsRequested = req.body.galReq;
      const address = req.body.delivAdd;
      const deliveryDate = req.body.delivDate;
      let result = priceModule.calculate(
        gallonsRequested,
        current_user.in_state,
        hist_factor
      );

      let customerPricePerGallon = parseFloat(
        result.customerPricePerGallon
      ).toFixed(2);

      let totalPrice = parseFloat(result.totalPrice).toFixed(2);
      res.render("fuelQuoteForm", {
        gallonsRequested,
        current_user,
        customerPricePerGallon,
        totalPrice,
        deliveryDate,
      });
    } else if (req.body.submit) {
      console.log("INSIDE SUBMIT");
      const gallonsRequested = req.body.galReq;
      const address = req.body.delivAdd;
      const deliveryDate = req.body.delivDate;
      let result = await FuelQuoteService.addEntry(
        hist_factor,
        current_user.in_state,
        current_user.email,
        gallonsRequested,
        address,
        deliveryDate
      );

      let customerPricePerGallon = parseFloat(
        result.customerPricePerGallon
      ).toFixed(2);

      let totalPrice = parseFloat(result.totalPrice).toFixed(2);
      res.redirect("history");
    }
  });

  app.get("/fuelQuoteForm", async (req, res) => {
    let hist = await History_User(current_user.email);
    if (hist) {
      hist_factor = true;
    }
    let customerPricePerGallon = parseFloat(0).toFixed(2);
    let totalPrice = parseFloat(0).toFixed(2);
    const deliveryDate = "0000-00-00";
    let gallonsRequested = "Enter Requested Gallons";
    res.render("fuelQuoteForm", {
      gallonsRequested,
      current_user,
      customerPricePerGallon,
      totalPrice,
      deliveryDate,
    });
  });

  app.get("/signup", (req, res) => {
    console.log("going to signup with nodejs - get");
    res.render("signup");
  });

  app.post("/signup", async (req, res) => {
    console.log("going to signup with nodejs - post");

    const email = req.body.email;
    const password = req.body.psw;
    const matchingpass = req.body.pswA;
    db.query(
      "SELECT * FROM customers WHERE email = ?",
      email,
      async (err, result) => {
        if (err) throw err;

        if (result != "") {
          res.render("signup", {
            e_message:
              'Email is already in use. To login please click cancel and then login. If you forgot your password, please click "Forgot password" \n',
          });
        } else {
          if (password != matchingpass) {
            res.render("signup", {
              message: "Password did not match, please try again! \n",
            });
          } else {
            const encryptedPassword = await bcrypt.hash(password, saltRounds);
            let info = [email, encryptedPassword];
            let string = encodeURIComponent(email + "|" + password);
            var sql = "INSERT INTO customers (email, password) VALUES (?)";
            db.query(sql, [info], function (err, result) {
              if (err) throw err;
            });
            res.redirect("profile?valid=" + string);
          }
        }
      }
    );
  });

  app.get("/history", async (req, res) => {
    db.query(
      "SELECT * FROM fuelQuotes WHERE user = ?",
      current_user.email,
      function (err, result) {
        const fuel_data_user = [];
        for (let quote of result) {
          fuel_data_user.push(quote);
        }
        res.render("history", { fuel_data_user });
      }
    );
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
      let street = current_user.street;
      let city = current_user.city;
      let state = current_user.state;
      let zip = current_user.zip;

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
    if (req.body.ad2) street = street + " " + req.body.ad2;
    let city = req.body.city;
    let state = req.body.state;
    let zip = req.body.zip;
    let name = req.body.name;
    let email = req.body.username;
    let password = req.body.password;

    await UserService.modifyEntry(
      email,
      name,
      street,
      password,
      city,
      state,
      zip
    );
    db.query(
      "SELECT * FROM customers WHERE email = ?",
      email,
      function (err, result) {
        if (err) throw err;
        if (result) {
          login_email = email;
          db.query(
            "SELECT * FROM customer_info WHERE username = ?",
            login_email,
            function (err, result) {
              if (err) throw err;
              if (result) {
                let in_state = result[0].state == "TX" ? true : false;
                current_user = {
                  email: result[0].username,
                  name: result[0].name,
                  street: result[0].street,
                  city: result[0].city,
                  state: result[0].state,
                  zip: result[0].zip,
                  in_state: in_state,
                };
                res.redirect("fuelQuoteForm");
              } else {
                console.log("result not found");
              }
            }
          );
        }
      }
    );
  });
}

//Start your server on a specified port
app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
