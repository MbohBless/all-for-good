const express = require('express');
const {protect} = require("../utils/auth");
const router = express.Router();
const Expenditure = require("../models/expenditure");
const User = require("../models/user");


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
            const dateObject = new Date(date);
            const expenditure = new Expenditure({
                amount, description, dateObject, user: req.user.id
            });
            await expenditure.save();
            const user = await User.findById(req.user.id);
            user.totalSavings -= amount;
            user.totalExpenditures += amount;
            await user.save();
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
                    date: new Date(expenditure.date),
                    user: req.user.id
                }
            }));
            const totalAmount = expenditures.reduce((acc, expenditure) => {
                return acc + expenditure.amount;
            }, 0);
            const user = await User.findById(req.user.id);
            user.totalSavings -= totalAmount;
            user.totalExpenditures += totalAmount;
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

module.exports = router;


