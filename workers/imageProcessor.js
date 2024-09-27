const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');

const imageQueue = new Queue('image-processing');

imageQueue.process(async (job) => {
  const options = { width: 100, height: 100 };
  const thumbnail = await imageThumbnail(job.data.filePath, options);
  // Save thumbnail or return
});

module.exports = imageQueue;

