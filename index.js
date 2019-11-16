"use strict";

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Finds the first row for which `weight` is within boundaries
let fromMaxWeightTable = table => weight => {
  const rate = table.find((row, _) => weight <= row[0]);
  return rate && rate[1];
};

// For tables, see: https://pe.usps.com/text/dmm300/Notice123.htm#_c037
let calculateStampedRate = fromMaxWeightTable([
  [1,   0.55],
  [2,   0.70],
  [3,   0.85],
  [3.5, 1.00]
]);

let calculateMeteredRate = fromMaxWeightTable([
  [1,   0.50],
  [2,   0.65],
  [3,   0.80],
  [3.5, 0.95]
]);

let calculateFlatsRate = fromMaxWeightTable([
  [1,   1.00],
  [2,   1.15],
  [3,   1.30],
  [4,   1.45],
  [5,   1.60],
  [6,   1.75],
  [7,   1.90],
  [8,   2.05],
  [9,   2.20],
  [10,  2.35],
  [11,  2.50],
  [12,  2.65],
  [13,  2.80]
]);

let calculateFirstClassRate = (zone, weight) => fromMaxWeightTable({
  1: [
    [4,   3.66],
    [8,   4.39],
    [12,  5.19],
    [13,  5.71]
  ],

  2: [
    [4,   3.66],
    [8,   4.39],
    [12,  5.19],
    [13,  5.71]
  ],

  3: [
    [4,   3.70],
    [8,   4.44],
    [12,  5.24],
    [13,  5.78]
  ],

  4: [
    [4,   3.74],
    [8,   4.49],
    [12,  5.30],
    [13,  5.85]
  ],

  5: [
    [4,   3.78],
    [8,   4.57],
    [12,  5.40],
    [13,  5.99]
  ],

  6: [
    [4,   3.82],
    [8,   4.57],
    [12,  5.40],
    [13,  5.99]
  ],

  7: [
    [4,   3.94],
    [8,   4.69],
    [12,  5.53],
    [13,  6.13]
  ],

  8: [
    [4,   4.06],
    [8,   4.81],
    [12,  5.66],
    [13,  6.27]
  ],

  9: [
    [4,   4.06],
    [8,   4.81],
    [12,  5.66],
    [13,  6.27]
  ]
}[zone] || [])(weight);


let handleRatesPage = (req, res) => {
  const weight = parseFloat(req.query['weight']) || 0;
  const zone = req.query['zone'] || 1;
  const mailType = req.query['mail-type'];

  const calculatedRate = {
    'stamped': calculateStampedRate,
    'metered': calculateMeteredRate,
    'flats': calculateFlatsRate,
    'first-class': weight => calculateFirstClassRate = (zone, weight)
  }[mailType];

  const rate = calculatedRate && calculatedRate(weight);

  res.render('pages/rates', {
    weight: weight,
    mailType: mailType,
    rate: rate
  })
};

express()
  // static files are in `./public/`
  .use(express.static(path.join(__dirname, 'public')))

  // views are in `./views/` and we are using ejs
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  // renders 
  .get('/getRate', handleRatesPage)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
