import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { promises as fs } from 'fs';
import mime from 'mime-types';
import imageThumbnail from 'image-thumbnail';
import Bull from 'bull';

// Bull queue for file processing
const fileQueue = new Bull('fileQueue');

// Helper function to get the user based on the token
const getUserFromToken = async (token) => {
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return null;
    const user = await dbClient.db.collection('users').findOne({ _id: dbClient.objectId(userId) });
    return user;
};

class FilesController {
    // POST /files - updated to handle background processing for thumbnails
    static async postUpload(req, res) {
        const token = req.headers['x-token'];
        const { name, type, isPublic, parentId, data } = req.body;

        const user = await getUserFromToken(token);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        if (!name || !type || !data) return res.status(400).json({ error: 'Missing parameters' });

        const filePath = `/tmp/files_manager/${name}`;

        try {
            await fs.writeFile(filePath, data, 'base64');

            const fileDocument = {
                userId: user._id,
                name,
                type,
                isPublic: isPublic || false,
                parentId: parentId || 0,
                localPath: filePath,
            };

            const result = await dbClient.db.collection('files').insertOne(fileDocument);

            // If the file is an image, add a job to the queue for thumbnail generation
            if (type === 'image') {
                fileQueue.add({ userId: user._id, fileId: result.insertedId });
            }

            return res.status(201).json({
                id: result.insertedId,
                userId: user._id,
                name,
                type,
                isPublic: isPublic || false,
                parentId: parentId || 0,
            });
        } catch (error) {
            return res.status(500).json({ error: 'Cannot upload file' });
        }
    }

    // GET /files/:id/data - updated to return thumbnails based on size
    static async getFile(req, res) {
        const token = req.headers['x-token'];
        const fileId = req.params.id;
        const size = req.query.size;

        // Find the file document based on the file ID
        const file = await dbClient.db.collection('files').findOne({ _id: dbClient.objectId(fileId) });
        if (!file) return res.status(404).json({ error: 'Not found' });

        // Check if the file is a folder
        if (file.type === 'folder') return res.status(400).json({ error: "A folder doesn't have content" });

        // If the file is not public and no authenticated user or user is not the owner
        const user = await getUserFromToken(token);
        if (!file.isPublic && (!user || String(file.userId) !== String(user._id))) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Handle thumbnail sizes
        let filePath = file.localPath;
        if (size && ['100', '250', '500'].includes(size)) {
            filePath = `${file.localPath}_${size}`;
        }

        // Check if the file exists locally
        try {
            const fileContent = await fs.readFile(filePath);
            const mimeType = mime.lookup(file.name);

            // Return the file content with the correct MIME-type
            res.setHeader('Content-Type', mimeType);
            return res.status(200).send(fileContent);
        } catch (error) {
            return res.status(404).json({ error: 'Not found' });
        }
    }
}

export default FilesController;

