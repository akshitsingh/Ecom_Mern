

const express = require('express');
const productRoute = require('./routes/productRoute');
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoute');
const errorMiddlware = require('./middleware/error');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json())

app.use(cookieParser());
//Routes imports

app.use('/api/v1',productRoute);
app.use('/api/v1',user);
app.use('/api/v1',order);

//Middleware for Errors
app.use(errorMiddlware)

module.exports = app;