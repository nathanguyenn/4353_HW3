NOTE: MUST install nodejs, express and mysql to run this project

This is an updated version of our app for 4353 prof. Singh. 

It uses expressjs and nodejs to power our static front end (html css js). 
This allows us to create multiple classes and dummy data (data folder) to demonstrate that our data is working.

you MUST have express, nodejs and ejs to run this project.
After you have confirmed those, go to server.js file in terminal, type "npm server.js" and it should launch on localhost:3000.

we uses different ways to connect, validate and establish our data. Since we havent worked on the price module, I will show you how 
to demonstrate our backend is working. 

Since, we are no longer using JSON file. We created a SQL database through MySQL Workbench 8.0 CE. Through this program, we were able to create our database and all the tables needed to fill in our information through the front end. In our report we included snippets of our database populated with customer information. Including the encryption of the password for each customer. For each data being filled in by our clients, each data populates to their specific columns within the tables we created. 

We also uses Mocha, Chai, and Supertest to create unit tests and do the code coverage report. 
We use Bcrypt to create encryption for our passwords.
