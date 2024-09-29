const { MongoClient } = require('mongodb');

const url = process.env.DB_HOST || 'mongodb://127.0.0.1:27017'; // Or your port if different
const dbName = process.env.DB_DATABASE || 'files_manager';
let db = null;

const connectToDb = async () => {
    try {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        db = client.db(dbName);
        console.log('Connected successfully to server');
        return db;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);  // Or handle the error more gracefully
    }
};

connectToDb();


module.exports = {
    connectToDb,
    isAlive: () => db !== null,
    nbUsers: async () => {
        if (!db) return 0;
        try {
            const usersCollection = db.collection('users');
            return await usersCollection.countDocuments();
        } catch (err) {
            console.error("Error counting users:", err);
            return 0; 
        }

    },
    nbFiles: async () => {
        if (!db) return 0;
        try {
          const filesCollection = db.collection('files');
          return await filesCollection.countDocuments();
        } catch (err) {
          console.error("Error counting files:", err);
          return 0;
        }
    },
};
