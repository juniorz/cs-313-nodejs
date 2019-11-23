"use strict";

const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const express = require('express');

const PORT = process.env.PORT || 5000;

const {Transaction, Categories} = require('./models');

let manageTransactions = async (req, res) => {
  try {
    const inserted = await Transaction.insert({
      amount: parseFloat(req.body.amount),
      date: req.body['date'],
      category_id: req.body['category_id'],
      description: req.body['description'],
    });
  
    const rows = await Transaction.get(inserted.id);

    res.status(201).json({transaction: rows[0]})
  }
  catch (e) {
    res.status(500).json({error: e.error});
  }
};

let listTransactions = async (req, res) => {
  try {
    let [categories, transactions] = await Promise.all([
      Categories.all(), Transaction.all()
    ]);

    res.render('pages/transactions', {
      categories: categories,
      transactions: transactions,
    });
  }
  catch (e) {
    console.log(e)
    res.status(500).json({error: e.error});
  }
};

let getTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.all();
    res.status(200).json({transactions: transactions});
  }
  catch (e) {
    console.log(e)
    res.status(500).json({error: e.error});
  }
};

express()
  .use(morgan('combined'))

  // static files are in `./public/`
  .use(express.static(path.join(__dirname, 'public')))
  .use(bodyParser.urlencoded({ extended: false }))

  // views are in `./views/` and we are using ejs
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')

  // renders 
  .get('/', listTransactions)
  .get('/transactions.json', getTransactions)
  .post('/transactions', manageTransactions)

  .listen(PORT, () => console.log(`Listening on ${ PORT }`));
