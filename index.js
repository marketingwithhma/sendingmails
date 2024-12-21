const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables from .env
const cors  = require("cors")
// Create an Express app
const app = express();
app.use(express.json()); // Parse JSON bodies
let corsOptions = {
  origin : ['http://127.0.0.1:8000'],
}

app.use(cors(corsOptions))
// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: "marketingwithhma@gmail.com", // Your email address
    pass: "lnfp mmbl yhtp pyey", // Your email password or app-specific password
  },
});

// Function to send email
async function sendEmail(email, otp) {
  try {
    const subject = "Your OTP Code"; // Email subject
    const message = `Hello,\n\nYour OTP code is: ${otp}\n\nThank you!`;

    const mailOptions = {
      from: `"Chat with HMA" <${process.env.EMAIL_USER}>`, // Sender email and name
      to: email, // Recipient email
      subject: subject, // Subject
      text: message, // Body content in plain text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    return `Email sent to ${email}: ${info.response}`;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error.message);
    throw error;
  }
}

// Endpoint to send email
app.post("/send-email", async (req, res) => {
  const { email, otp } = req.body; // Extract email and OTP from request body

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required." });
  }

  try {
    const response = await sendEmail(email, otp); // Call sendEmail function
    res.status(200).json({ success: true, message: response });
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//verify otp at frontend for now