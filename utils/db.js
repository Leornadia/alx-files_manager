// utils/db.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.client.connect()
            .then(() => {
                this.db = this.client.db(database);
                console.log('Successfully connected to MongoDB');
            })
            .catch((err) => {
                console.error('Failed to connect to MongoDB:', err);
            });
    }

    // Check if the connection to MongoDB is alive
    isAlive() {
        return this.client && this.client.isConnected();
    }

    // Get the number of users in the 'users' collection
    async nbUsers() {
        const usersCollection = this.db.collection('users');
        const count = await usersCollection.countDocuments();
        return count;
    }

    // Get the number of files in the 'files' collection
    async nbFiles() {
        const filesCollection = this.db.collection('files');
        const count = await filesCollection.countDocuments();
        return count;
    }
}

// Export an instance of the DBClient
const dbClient = new DBClient();
export default dbClient;

