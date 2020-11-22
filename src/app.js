var bodyParser = require('body-parser')
const compression = require('compression');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('./logging/morgan');

const route = require('./routes/index');
const authRoute = require('./routes/authRouter');
const ordersRoute = require('./routes/ordersRouter');

const app = express();

const expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'Restaurant server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:8080',
        basePath: '/api',
        produces: [
            "application/json",
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['./**/*.js'] //Path to the API handle folder
};
expressSwagger(options);

// Connection
mongoose
    .connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
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
app.use('/api/auth', authRoute);
app.use('/api/orders', ordersRoute);

// Export app
module.exports = app;