import nodemailer from "nodemailer";

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
    // host: "gmail",
    service: "gmail",
    // port: 587,
    // secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send an email using async/await
export async function sendEmail(reciver,subject,html)  {
    const info = await transporter.sendMail({
        from: '"Inpired Living" samarths716@gmail.com',
        to: reciver,
        subject,
        html, 
    });

    console.log("Message sent:", info.messageId);
}