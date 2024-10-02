import Bull from 'bull';
import { promises as fs } from 'fs';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';

// Create a Bull queue
const fileQueue = new Bull('fileQueue');

// Process the fileQueue for thumbnail generation
fileQueue.process(async (job, done) => {
    const { fileId, userId } = job.data;

    // Check if fileId or userId is missing
    if (!fileId) throw new Error('Missing fileId');
    if (!userId) throw new Error('Missing userId');

    // Find the file document in the DB
    const file = await dbClient.db.collection('files').findOne({ _id: dbClient.objectId(fileId), userId: dbClient.objectId(userId) });
    if (!file) throw new Error('File not found');

    // Check if the file is an image
    if (file.type !== 'image') throw new Error('File is not an image');

    // Generate thumbnails for 500px, 250px, and 100px
    try {
        const thumbnailSizes = [500, 250, 100];
        for (const size of thumbnailSizes) {
            const thumbnail = await imageThumbnail(file.localPath, { width: size });
            const thumbnailPath = `${file.localPath}_${size}`;
            await fs.writeFile(thumbnailPath, thumbnail);
        }
        done();
    } catch (error) {
        done(new Error('Failed to generate thumbnails'));
    }
});

