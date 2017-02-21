const express = require('express');
const quote = express.Router();

quote.get('/', (req, res) => {
    res.send([]);
});

module.exports = quote;
