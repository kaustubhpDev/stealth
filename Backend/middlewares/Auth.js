const ErrorHandler = require("../utils/errorHandelr");
const jwt = require("jsonwebtoken");
const CatchAsyncError = require("./CatchAsyncError");
const user = require("../model/User");
const client = require("../config/dbConfig");


exports.isAuthenticatedUser = CatchAsyncError(async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const result = await client.query(`SELECT * FROM users WHERE id = $1`, [
            userId,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        req.user = result.rows[0];
    } catch (err) {
        return res.status(401).send(err.message);
    }
    return next();

})
exports.isAuthenticatedHR = CatchAsyncError(async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const result = await client.query(`SELECT * FROM hr WHERE id = $1`, [
            userId,
        ]);
        if (result.rows.length === 0) {
            return res.status(404).send({ message: "User not found" });
        }
        req.user = result.rows[0];
    } catch (err) {
        return res.status(401).send(err.message);
    }
    return next();

})


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.Role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.Role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};