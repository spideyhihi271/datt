require('dotenv').config();
require('express-async-errors');

// Dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
const db = require('./config/db');
const route = require('./src/routes');
const app = express();

// Config
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect DB & use Route
db.connect();
route(app);

// Run Server
app.listen(port, console.log('Server is running at port', port));
