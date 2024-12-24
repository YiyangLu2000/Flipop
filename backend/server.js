const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

app.use(cors());

require('dotenv').config();

// Connects to MongoDB database
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Keeps track of user's info
let userInfo;

// Connect to MongoDB and initialize the favorites collection
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const db = client.db('Flipop'); // My database name
        userInfo = db.collection('UserInfo'); // My collection name

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

app.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await userInfo.findOne({ email });

        if (existingUser) {
            res.status(200).json({ exist: true, message: "User already registered." });
        } else {
            res.status(200).json({ exist: false, message: "Email available for registration." });
        }
    } catch (error) {
        console.error('Error during email check:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

// Set your refresh token
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Function to create the transporter with access token
async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken(); // Dynamically get access token
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "noreply@flipopapp.com",
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token, // Use the dynamically fetched access token
        },
    });
}

// Endpoint to send the verification email
app.post('/send-verification', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    try {
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: '15m' });
        const verificationLink = `http://localhost:3000/verify?token=${token}`;

        const transporter = await createTransporter(); // Get transporter with access token

        await transporter.sendMail({
            from: "noreply@flipopapp.com",
            to: email,
            subject: "Verify Your Email",
            html: `
          <p>Click the link below to verify your email address:</p>
          <a href="${verificationLink}">${verificationLink}</a>
          <p>This link will expire in 15 minutes.</p>
        `,
        });

        res.status(200).json({ message: "Verification email sent successfully." });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: "Failed to send verification email." });
    }
});

// Endpoint to verify the token
app.get("/verify", (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        res.status(200).json({ message: "Email verified successfully.", email: decoded.email });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Invalid or expired token." });
    }
});

// Register User
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user to the database
        const newUser = {
            email,
            password: hashedPassword,
        };

        await userInfo.insertOne(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database
        const user = await userInfo.findOne({ email });

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { email: user.email },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
