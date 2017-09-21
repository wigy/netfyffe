const express = require('express');
const router = express.Router();
const db = require('../db');

const INDUSTRIES = [
    {id: 0, name: 'N/A'},
    {id: 10, name: 'Energy'},
    {id: 15, name: 'Materials'},
    {id: 20, name: 'Industrials'},
    {id: 25, name: 'Consumer Discretionary'},
    {id: 30, name: 'Consumer Staples'},
    {id: 35, name: 'Health Care'},
    {id: 40, name: 'Financials'},
    {id: 45, name: 'Information Technology'},
    {id: 50, name: 'Telecommunication Services'},
    {id: 60, name: 'Real Estate'},
];

/**
 * Get available industries.
 *
 * https://en.wikipedia.org/wiki/Global_Industry_Classification_Standard
 */
router.get('/', (req, res) => {
    res.send(INDUSTRIES);
});

module.exports = router;
