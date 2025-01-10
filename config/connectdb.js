import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try {
        const DB_OPTIONS = {
            dbName: "Himanshu", // Specify your database name here
        };
        await mongoose.connect(DATABASE_URL, DB_OPTIONS);
        console.log("Connected successfully .....");
    } catch (error) {
        console.log("Error connecting to the database:", error);
    }
};

export default connectDB;

