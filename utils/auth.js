import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const comparePasswords = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};
export const hasPassword = async (password) => {
    return await bcrypt.hash(password, 5);
};

export const createJWT = async (user) => {
    const token = await jwt.sign(
        {id: user.id, name: user.name},
        process.env.JWT_SECRET
    );
    return token;
};
export const protect = (req, res, next) => {
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
        req.user = user;
        next();
    } catch (e) {
        console.log(e);
        res.status(401);
        res.json({message: "The token cannot be identified "});
        return;
    }
};