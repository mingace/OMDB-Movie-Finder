const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv').config();

app.use(morgan('tiny'));

const cache = {};

app.get('/', function (req, res) {
    let url = req.query;
    let apiUrl;
    for (const key in url) {
        if (url.hasOwnProperty(key)) {
            console.log(url[key])
            if (key === 'i' && cache['i'] !== undefined) {
                apiUrl = `${process.env.APP_DOMAIN}?apikey=${process.env.APP_API_KEY}&i=${cache['i']}`;
            } else if (key === 't' && cache['t'] !== undefined) {
                apiUrl = `${process.env.APP_DOMAIN}?apikey=${process.env.APP_API_KEY}&t=${cache['t']}`;
            } else {
                apiUrl = `${process.env.APP_DOMAIN}?apikey=${process.env.APP_API_KEY}&${key}=${url[key]}`;
                cache[key] = url[key];
            }
                console.log('after', cache[key]);
                axios.get(apiUrl)
                .then(response => {
                    res.send(response.data);
                })
                .catch (error => {
                    console.log(error.response); 
                });
            }
        }
    });
    module.exports = app
