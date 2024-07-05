const express = require('express');
const mongoose= require('mongoose');
const compression= require('compression');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const winston = require('winston');
const config = require('./config/config');

// routes
const routes= require('./routes/index'); 

const app = express();

//Middlewares

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(
    cors({
        origin: process.env.ALLOW_ORIGINS || '*'
    })
);
//  Session Management

// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: new MongoStore({ mongooseConnection: mongoose.connection }),
//     cookie: {
//         secure: true, // Set to true if using HTTPS
//         httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//         maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
// }));

// Error handling
app.use((err, req, res, next) => {
    winston.error(err.message, err);
    res.status(err.status || 500).send({ error: 'Something went wrong' });
});

mongoose.connect(config.mongoURI)
.then(()=>console.log('MongoDB Connected'))
.catch(err=>console.log(err));

app.use('/',routes);

module.exports= app;