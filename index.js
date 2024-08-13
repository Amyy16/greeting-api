const express = require("express");
require("dotenv").config();
const axios = require("axios");
const requestip = require("request-ip");
const port = process.env.PORT || 8000;
const ipstack = process.env.IPSTACK_ACCESS_KEY;

app = express();
app.use(express.json());
app.use(requestip.mw());

app.get("/api/hello", async (req, res) => {
  try {
    const visitor_name = req.query.visitor_name || "guest";
    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    console.log(ipAddress);
    const response = await axios.get(
      `http://api.ipstack.com/${ipAddress}? access_key = ${ipstack}`
    );
    const location = response.data.city;
    res.json({ visitor_name: visitor_name, ip: ipAddress, location: location });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.listen(port, (req, res) => {
  console.log(`app is running on port ${port}`);
});
