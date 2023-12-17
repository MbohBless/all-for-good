const express = require('express');
const {hasPassword, createJWT, comparePasswords, protect} = require("../utils/auth");
const router = express.Router();
const User = require("../models/user");

/* GET users listing. */
router.post('/create-account', async function (req, res, next) {
    const {
        name,
        password,
        email
    } = req.body;

    if (!name || !password || !email) {
        res.status(400).json({
            message: "invalid input"
        });
        return;
    }
    const hashedPassword = await hasPassword(password);
    const user = new User({
        name,
        password: hashedPassword,
        email
    });
    await user.save();
    const jwt = await createJWT(user);

    res.json({
        message: "user created",
        token: jwt
    });

});

router.post('/login', async function (req, res, next) {
        const data = req.body;
        const {
            password,
            email
        } = data;
        if (!password || !email) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }
        const user = await User.findOne({
            email
        })
        if (!user) {
            res.status(401).json({
                message: "unauthorized"
            });
            return;
        }
        const validPassword = await comparePasswords(password, user.password);
        if (!validPassword) {
            res.status(401).json({
                message: "unauthorized"
            });
            return;
        }
        const jwt = await createJWT(user);
        res.json({
            message: "user logged in",
            token: jwt
        });
    }
);

router.put('/me', protect, async function (req, res, next) {
    try {
        const data = req.body;
        const {
            name,
            password,
            email
        } = data;
        if (!name || !password || !email) {
            res.status(400).json({
                message: "invalid input"
            });
            return;
        }
        const hashedPassword = await hasPassword(password);
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            password: hashedPassword,
            email
        }, {new: true});
        res.json({
            message: "user updated",
            user: {
                name: user.name,
                email: user.email,
                totalSavings: user.totalSavings,
                totalExpenditures: user.totalExpenditures
            }
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "something went wrong"
        })
    }

});


// get me
router.get('/me', protect, async function (req, res, next) {
    const user = req.user;
    res.json({
        user
    });
});


module.exports = router;
