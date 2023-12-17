const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expendituresRouter = require('./routes/expenditure');
const savingsRouter = require('./routes/savings');
const { connectToDatabase } = require("./db/connecr");



dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectToDatabase(process.env.DATABASEURL, 3)
    .then(() => {
        app.use('/', indexRouter);
        app.use('/users', usersRouter);
        app.use('/expenditures', expendituresRouter);
        app.use('/savings', savingsRouter);

        app.use((err, req, res, next) => {
            if (err.type === "auth") {
                res.status(401).json({ message: "unauthorized" });
            } else if (err.type === "input") {
                res.status(400).json({ message: "invalid input" });
            } else {
                res.status(500).json({ message: "internal server error" });
            }
        });
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });

module.exports = app;
