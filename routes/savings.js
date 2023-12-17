const express = require('express');
const {protect} = require("../utils/auth");
const router = express.Router();
import Savings from "../models/savings";


router.get('/', protect, async function (req, res, next) {
//     getting all my savings from the database
    try {
        const savings = await Savings.find({
            user: req.user.id
        });
        res.json({
            savings
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
        const saving = new Savings({
            amount, description, date, user: req.user.id
        });
        await saving.save();
        res.json({
            message: "saving created", saving
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })

    }
});
router.post('/bulk', protect, async function (req, res, next) {
    try {
        const data = req.body
        const {
            savings
        } = data;
        if (!savings || !Array.isArray(savings) || savings.length === 0) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }

        for (let i = 0; i < savings.length; i++) {
            const {
                amount, description, date
            } = savings[i];
            if (!amount || !description || !date) {
                res.status(400).json({
                    message: "invalid input"
                });
                return;
            }
        }

        const savingsToSave = savings.map((saving) => {
            return {
                amount: saving.amount, description: saving.description, date: saving.date, user: req.user.id
            }
        })
        await Savings.insertMany(savingsToSave);
        const total = savingsToSave.reduce((acc, curr) => {
            return acc + curr.amount;
        }, 0);
        const user = req.user
        user.totalExpenditures += total;
        await user.save();
        res.json({
            message: "savings created", savings: savingsToSave
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })

    }
})

router.get('/:id', protect, async function (req, res, next) {
    try {
        const {
            id
        } = req.params;
        if (!id) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }
        const saving = await Savings.findById(id);
        if (!saving) {
            res.status(404).json({
                message: "saving not found"
            });
            return;
        }
        res.json({
            saving
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })
    }

});

router.put('/:id', protect, async function (req, res, next) {
        try {
            const {
                id
            } = req.params;
            const data = req.body
            const {
                amount, description, date
            } = data;
            if (!id || !amount || !description || !date) {
                res.status(400).json({
                    message: "invalid input"
                });
                return;
            }
            const saving = await Savings.findById(id);
            if (!saving) {
                res.status(404).json({
                    message: "saving not found"
                });
                return;
            }
            saving.amount = amount;
            saving.description = description;
            saving.date = date;
            await saving.save();
            res.json({
                message: "saving updated", saving
            });
        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "something went wrong"
            })
        }
    }
);

router.delete('/:id', protect, async function (req, res, next) {
    try {
        const {
            id
        } = req.params;
        if (!id) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }
        const saving = await Savings.findById(id);
        if (!saving) {
            res.status(404).json({
                message: "saving not found"
            });
            return;
        }
        const user = req.user;
        user.totalSavings -= saving.amount;
        await user.save();
        await saving.delete();
        res.json({
            message: "saving deleted"
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })
    }
});


module.exports = router;