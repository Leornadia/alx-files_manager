import dbClient from '../utils/db';
import redisClient from '../utils/redis';

// Helper function to get the user based on the token
const getUserFromToken = async (token) => {
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return null;
    const user = await dbClient.db.collection('users').findOne({ _id: dbClient.objectId(userId) });
    return user;
};

class FilesController {
    // GET /files/:id
    static async getShow(req, res) {
        const token = req.headers['x-token'];
        const fileId = req.params.id;

        // Validate the token and get the user
        const user = await getUserFromToken(token);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Find the file document based on the file ID
        const file = await dbClient.db.collection('files').findOne({ _id: dbClient.objectId(fileId), userId: user._id });
        if (!file) return res.status(404).json({ error: 'Not found' });

        // Return the file document
        return res.status(200).json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
            localPath: file.localPath || null,
        });
    }

    // GET /files
    static async getIndex(req, res) {
        const token = req.headers['x-token'];
        const parentId = req.query.parentId || '0';
        const page = parseInt(req.query.page, 10) || 0;
        const pageSize = 20;

        // Validate the token and get the user
        const user = await getUserFromToken(token);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Fetch files based on parentId and with pagination
        const files = await dbClient.db.collection('files')
            .find({
                userId: user._id,
                parentId: parentId === '0' ? '0' : dbClient.objectId(parentId),
            })
            .skip(page * pageSize)
            .limit(pageSize)
            .toArray();

        // Return the list of files
        return res.status(200).json(files.map((file) => ({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: file.isPublic,
            parentId: file.parentId,
            localPath: file.localPath || null,
        })));
    }

    // PUT /files/:id/publish
    static async putPublish(req, res) {
        const token = req.headers['x-token'];
        const fileId = req.params.id;

        // Validate the token and get the user
        const user = await getUserFromToken(token);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Find the file document based on the file ID and user
        const file = await dbClient.db.collection('files').findOne({ _id: dbClient.objectId(fileId), userId: user._id });
        if (!file) return res.status(404).json({ error: 'Not found' });

        // Update the file's isPublic property to true
        await dbClient.db.collection('files').updateOne(
            { _id: dbClient.objectId(fileId) },
            { $set: { isPublic: true } }
        );

        // Return the updated file document
        return res.status(200).json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: true, // Updated value
            parentId: file.parentId,
            localPath: file.localPath || null,
        });
    }

    // PUT /files/:id/unpublish
    static async putUnpublish(req, res) {
        const token = req.headers['x-token'];
        const fileId = req.params.id;

        // Validate the token and get the user
        const user = await getUserFromToken(token);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });

        // Find the file document based on the file ID and user
        const file = await dbClient.db.collection('files').findOne({ _id: dbClient.objectId(fileId), userId: user._id });
        if (!file) return res.status(404).json({ error: 'Not found' });

        // Update the file's isPublic property to false
        await dbClient.db.collection('files').updateOne(
            { _id: dbClient.objectId(fileId) },
            { $set: { isPublic: false } }
        );

        // Return the updated file document
        return res.status(200).json({
            id: file._id,
            userId: file.userId,
            name: file.name,
            type: file.type,
            isPublic: false, // Updated value
            parentId: file.parentId,
            localPath: file.localPath || null,
        });
    }
}

export default FilesController;

