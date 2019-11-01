require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const cardRouter = require('../src/card/card-router');
const listRouter = require('../src/list/list-router');
const logger = require('./logger');

const app = express();
app.use(express.json());



const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/card', cardRouter);
app.use('/list', listRouter);

app.use(function validateBearerToken(req,res,next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  if(!authToken || authToken.split(' ')[1] !== apiToken){
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized Request'});
  }
  next();
});

app.get('/', (req,res) => {
  res.send('Hello, world');
});




app.use(function errorHandler(error,req,res,next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message };
  }
  res.status(500).json(response);
});


  module.exports = app;