import express from "express";
const router = express.Router()

import UserController from "../controllers/userController.js";
import checkUserAuth from "../middlewares/auth-middleware.js";

// Routhr Level Middleware -   To Protect Route
router.use('/chngepass', checkUserAuth)
router.use('/loggedUser', checkUserAuth)


// Public Routes  
router.post("/register", UserController.userRegisteration)
router.post("/login", UserController.userLogin)
router.post("/sendUser_Password_Rest_Email", UserController.sendUserPasswordRestEmail)
router.post("/Rest_Password/:id/:token", UserController.userPasswordRest)


// Protected Routes
router.post("/chngepass", UserController.changeUserPassword)
router.get("/loggedUser", UserController.loggedUser)


export default router