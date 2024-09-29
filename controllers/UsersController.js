import mongoose from 'mongoose';

// Define your User model (adapt to your schema)
const User = mongoose.model('User', { email: String, password: String });

const UsersController = {
    async getMe(req, res) {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json({ id: user._id, email: user.email });
    },
};

export default UsersController;
