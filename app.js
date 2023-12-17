const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const {connectToDatabase} = require("./db/connecr");

const app = express();

app.use(logger('dev'));
dotenv.config();
connectToDatabase(
    process.env.DATABASE_URL,
    3).then(() => {
    console.log("Database connected")
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use((err, req, res, next) => {
        if (err.type === "auth") {
            res.status(401).json({message: "unauthorized"});
        } else if (err.type === "input") {
            res.status(400).json({message: "invalid input"});
        } else {
            res.status(500).json({message: "the error is from me bless"});
        }
    })
}).catch((e) => {
    console.log(e)
    console.log("Database connection failed")

})


module.exports = app;
