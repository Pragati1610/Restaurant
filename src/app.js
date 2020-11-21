var bodyParser = require('body-parser')
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('./logging/morgan');

const route = require('./routes/index');
const adminRoute = require('./routes/adminRouter');
const ordersRoute = require('./routes/ordersRouter');

const app = express();

// Connection
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connections successful'));


// Middlewares
app.use(bodyParser.json());
app.use(compression());
app.use(cors());

// Logging
app.use(morgan);

// Mount routes
app.use('/', route);
app.use('/api/admin', adminRoute);
app.use('/api/orders', ordersRoute);

// Export app
module.exports = app;