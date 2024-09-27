const File = require('../models/File');

const updateFilePermission = async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file || file.userId.toString() !== req.user._id.toString()) {
    return res.status(403).send('Not authorized');
  }

  file.isPublic = !file.isPublic;
  await file.save();
  res.json(file);
};

