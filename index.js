require('express-async-errors');
require('dotenv').config();
const express = require('express');
const logger = require('morgan');
const routes = require('./routes')
const Database = require('./middlewares/database-middleware');
const error = require('./middlewares/error-middleware')
const { sendJson } = require('./middlewares/generateResponse-middleware');
Database.connect();

const app = express();
app.response.sendJson = sendJson;
const port = process.env.PORT || 8081;

if(app.get('env') == 'development')
    app.use(logger('dev'));

app.use(express.json());
app.use('/', routes);

/* Error Handling middlewares */  

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

app.listen(port, () => {
    if (app.get('env') == 'development') 
        console.log(`-----------> Server is up and running at ${port} <----------`)
});

module.exports = app;
