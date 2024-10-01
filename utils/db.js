const { MongoClient } = require('mongodb');

const url = process.env.DB_HOST || 'mongodb://127.0.0.1:27017'; // Database URL
const dbName = process.env.DB_DATABASE || 'files_manager';     // Database Name
let db = null;  // Global variable to store the db instance

const connectToDb = async () => {
    if (db) return db;  // If already connected, return the db instance
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        db = client.db(dbName);
        console.log('Connected successfully to MongoDB');
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw new Error('Unable to connect to MongoDB');
    }
};

// Initialize the database connection (remove process.exit)
connectToDb().catch((err) => {
    console.error(err);
});

// Export functions
module.exports = {
    connectToDb,
    isAlive: () => db !== null,  // Check if DB connection is active
    nbUsers: async () => {
        if (!db) return 0;  // Ensure DB is connected
        try {
            const usersCollection = db.collection('users');
            return await usersCollection.countDocuments();  // Return the user count
        } catch (err) {
            console.error("Error counting users:", err);
            return 0;
        }
    },
    nbFiles: async () => {
        if (!db) return 0;  // Ensure DB is connected
        try {
            const filesCollection = db.collection('files');
            return await filesCollection.countDocuments();  // Return the file count
        } catch (err) {
            console.error("Error counting files:", err);
            return 0;
        }
    },
};

