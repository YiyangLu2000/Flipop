const express = require('express');
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });