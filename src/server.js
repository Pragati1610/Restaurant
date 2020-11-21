const app = require('./app');
const dotenv = require('dotenv');
const http = require('http');
const logger = require('./logging/logger');

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
    logger.info(`started server on port ${PORT}`);
});