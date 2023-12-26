const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv').config();

app.use(morgan('tiny'));

const cache = new Map();

app.get('/', function (req, res) {
  const url = req.query;
  const cacheKey = JSON.stringify(url);
  console.log(cacheKey);

  if (cache.has(cacheKey)) {
    console.log(`Information for ${cacheKey} is being pulled from cache`);
    res.send(cache.get(cacheKey));
    return;
  }

  let apiUrl = `${process.env.APP_DOMAIN}?apikey=${process.env.APP_API_KEY}`;

  for (const key in url) {
    apiUrl += `&${key}=${url[key]}`;
  }

  console.log(`Information is being pulled from axios`);
  axios.get(apiUrl)
    .then(response => {
      const responseData = { ...response.data };
      cache.set(cacheKey, responseData);
      res.send(responseData);
    })
    .catch(error => {
      console.error("Axios error:", error.response || error.message);
      res.status(500).send('Internal Server Error');
    });
});

module.exports = app;