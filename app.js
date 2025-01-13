import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import connectDB from "./config/connectdb.js"
import UserController from "./controllers/userController.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

app.use(cors())

// DataBase Connection
connectDB(DATABASE_URL)

// JSON
app.use(express.json())


// Load Routes 
app.use("/", (req, res) => {
    res.status(200).json({ message: "your app is running successfully" })
})
app.use("/api/user", userRoutes)


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);

})
