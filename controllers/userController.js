import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailconfig.js";
import dotenv from 'dotenv';
dotenv.config();


class UserController {
    // SIGNUP USER......
    static userRegisteration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;
        const user = await UserModel.findOne({ email: email });
        if (user) {
            res.send({ status: "failed", message: "Email already exists" });
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hashPassword = await bcrypt.hash(password, salt);
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc,
                        });
                        await doc.save();
                        const saved_user = await UserModel.findOne({
                            email: email,
                        });
                        // Generate JWT token
                        const token = jwt.sign(
                            { userID: saved_user._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "5d" }
                        );
                        console.log("Generated Token (Signup):", token); // Log the token in the terminal
                        res.status(201).send({
                            status: "success",
                            message: "Registered successfully...",
                            token: token,
                        });
                    } catch (error) {
                        console.log(error);
                        res.send({ status: "failed", message: "Unable To Register" });
                    }
                } else {
                    res.send({
                        status: "failed",
                        message: "Password and confirm password don't match",
                    });
                }
            } else {
                res.send({ status: "failed", message: "All fields are required" });
            }
        }
    };

    // LOGIN USER........
    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body;
            if (email && password) {
                const user = await UserModel.findOne({ email: email });
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (user.email === email && isMatch) {
                        // Generate JWT token
                        const token = jwt.sign(
                            { userID: user._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: "5d" }
                        );
                        console.log("Generated Token (Login):", token); // Log the token in the terminal
                        res.send({
                            status: "success",
                            message: "Login successfully...",
                            token: token,
                        });
                    } else {
                        res.send({
                            status: "failed",
                            message: "Email or Password is not valid",
                        });
                    }
                } else {
                    res.send({ status: "failed", message: "Not Registered ..." });
                }
            } else {
                res.send({ status: "failed", message: "All fields are required" });
            }
        } catch (error) {
            console.log(error);
            res.send({ status: "failed", message: "Unable To Login" });
        }
    };

    // CHANGE PASSWORD USER .......
    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({
                    status: "failed",
                    message: "Password and confirm_password don't match",
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt);
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
                console.log(req.user);

                res.send({
                    status: "success",
                    message: "Password Changed Successfully....",
                });
            }
        } else {
            res.send({ status: "failed", message: "All Fields are Required" });
        }
    };
    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }
    static sendUserPasswordRestEmail = async (req, res) => {
        const { email } = req.body
        if (email) {
            const user = await UserModel.findOne({ email: email })
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, {
                    expiresIn: '17m'
                })
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                // Send Email....
                try {
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL_FROM,
                        to: user.email,
                        subject: "Password Reset Link",
                        html: `<a href=${link}>Click Here</a> to Reset Your Password`
                    });
                    res.send({ status: "success", message: "Password Reset Email Sent. Please Check Your Email.", info });
                } catch (error) {
                    console.log("Email Sending Error:", error);
                    res.send({ status: "failed", message: "Failed to send the email. Please try again later." });
                }

            } else {
                res.send({ "status": "failed", "message": "Email does't exist...." })
            }
        } else {
            res.send({ "status": "failed", "message": "Email Field is required...." })
        }
    }
    static userPasswordRest = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    res.send({ "status": "failed", "message": "Password and Confirm Password does't Match...." })

                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);
                    await UserModel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } })
                    res.send({ "status": "success", "message": "Password Reset Successfully...." })
                }
            } else {
                res.send({ "status": "failed", "message": "All Feilds are required...." })
            }
        } catch (error) {
            console.log(error);
            res.send({ "status": "failed", "message": "Invalid Token...." })
        }
    }

}

export default UserController;
