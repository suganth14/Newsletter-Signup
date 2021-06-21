//jshint esversion:6
require('dotenv').config()


const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const eMail = req.body.email;

  var data = {
    members: [{
      email_address: eMail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);
  const url = process.env.URL + process.env.LIST_ID;

  const options = {
    method: "POST",
    auth: process.env.name + ":" + process.env.API_KEY
  };

  const request = https.request(url, options, function(response) {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      // console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});


app.post("/failure", function(req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
