const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
}
);

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

// Register User
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await userInfo.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

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
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
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