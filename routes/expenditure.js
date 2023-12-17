const express = require('express');
const {protect} = require("../utils/auth");
const router = express.Router();
const Expenditure = require("../models/expenditure");


router.get('/', protect, async function (req, res, next) {
//     getting all my expenditure from the database
    try {
        const expenditure = await Expenditure.find({
            user: req.user.id
        });
        res.json({
            expenditure
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })
    }
});

router.post('/', protect, async function (req, res, next) {
        try {
            const data = req.body
            const {
                amount, description, date
            } = data;
            if (!amount || !description || !date) {
                res.status(400).json({
                    message: "invalid input"
                });
                return;
            }
            const expenditure = new Expenditure({
                amount, description, date, user: req.user.id
            });
            await expenditure.save();
            const user = req.user;
            user.totalSavings -= amount;
            user.totalExpenditures += amount;
            res.json({
                message: "expenditure created", expenditure
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "something went wrong"
            })

        }
    }
);

router.post('/bulk', protect, async function (req, res, next) {
        try {
            const data = req.body
            const {
                expenditures
            } = data;
            if (!expenditures || !Array.isArray(expenditures) || expenditures.length === 0) {
                res.status(400).json({
                    message: "invalid input"
                });
                return;
            }
            const expenditure = await Expenditure.insertMany(expenditures.map((expenditure) => {
                return {
                    ...expenditure,
                    user: req.user.id
                }
            }));
            const user = req.user;
            user.totalSavings -= expenditure.reduce((acc, curr) => acc + curr.amount, 0);
            user.totalExpenditures += expenditure.reduce((acc, curr) => acc + curr.amount, 0);
            await user.save();
            res.json({
                message: "expenditures created", expenditure
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "something went wrong"
            })
        }
    }
);



