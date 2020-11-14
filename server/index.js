const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/data", (req, res) => {
  axios
    .post(
      "https://87o2eq9h6k.execute-api.eu-west-1.amazonaws.com/dev/build",
      req.body
    )
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.listen(1337);
