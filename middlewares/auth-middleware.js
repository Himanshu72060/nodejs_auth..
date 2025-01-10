import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        try {
            // Get Token from Header
            token = authorization.split(' ')[1];
            console.log("Extracted Token:", token);
            console.log("Authorization Header:", authorization);

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log("Decoded Token:", decoded);

            // Get User from Token
            req.user = await UserModel.findById(decoded.userID).select("-password");
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).send({ status: "failed", message: "Unauthorized User" });
        }
    } else {
        if (!token) {
            console.warn("No token provided");
            res.status(401).send({ status: "failed", message: "Unauthorized User, No token" });
        }
    }
};

export default checkUserAuth;
