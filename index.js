const express = require("express");
require("dotenv").config();
const axios = require("axios");
const port = process.env.PORT || 8000;
const ipstack = process.env.IPSTACK_ACCESS_KEY;
const openweather = process.env.OPENWEATHER_API_KEY;

const app = express();
app.use(express.json());
// app.use(requestip.mw());

app.get("/api/hello", async (req, res) => {
  try {
    const { visitor_name } = req.query || "guest";
    const ipAddress =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    console.log(ipAddress);

    //fetch location
    const response = await axios.get(
      `http://api.ipstack.com/${ipAddress}?access_key=${ipstack}`
    );
    const location = response.data.city;

    // fetch weather using location
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${openweather}&units=metric`
    );
    const weather = weatherResponse.data.main.temp;

    res.status(200).json({
      visitor_name: visitor_name,
      ip: ipAddress,
      location: location,
      weather: weather,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.listen(port, (req, res) => {
  console.log(`app is running on port ${port}`);
});
