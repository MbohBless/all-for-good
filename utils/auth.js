const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
const hasPassword = async (password) => {
    return await bcrypt.hash(password, 5);
};

const createJWT = async (user) => {
    const token = await jwt.sign(
        {id: user._id, name: user.name},
        process.env.JWT_SECRET
    );
    return token;
};
const protect = async (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401);
        res.json({message: "not authorized"});
        return;
    }
    const [, token] = bearer.split(" ");
    if (!token) {
        res.status(401);
        res.json({message: "not valid token "});
        return;
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        const mongoUser = await User.findById(user.id);
        if (!mongoUser) {
            res.status(401);
            res.json({message: "not valid token "});
            return;
        }
        req.user = {
            id: mongoUser._id,
            name: mongoUser.name,
            email: mongoUser.email,
            totalSavings: mongoUser.totalSavings,
            totalExpenditures: mongoUser.totalExpenditures
        };
        next();
    } catch (e) {
        console.log(e);
        res.status(401);
        res.json({message: "The token cannot be identified "});
        return;
    }
};
module.exports = {
    comparePasswords,
    hasPassword,
    createJWT,
    protect
};