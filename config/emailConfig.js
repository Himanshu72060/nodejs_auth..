import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // Corrected the key to `port` instead of `POST`
    secure: false, // Use true for 587, false for other ports like 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// transporter.verify((error, success) => {
//     if (error) {
//         console.log('SMTP Connection Error:', error);
//     } else {
//         console.log('SMTP Server is ready to send emails.');
//     }
// });


export default transporter;