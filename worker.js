import Bull from 'bull';
import nodemailer from 'nodemailer';
import dbClient from './utils/db';

export const userQueue = new Bull('userQueue');

// Set up email transport (use a real SMTP server in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Process the queue
userQueue.process(async (job, done) => {
  const { userId } = job.data;

  if (!userId) {
    done(new Error('Missing userId'));
    return;
  }

  // Fetch user from the database
  const user = await dbClient.usersCollection.findOne({ _id: ObjectId(userId) });

  if (!user) {
    done(new Error('User not found'));
    return;
  }

  // Send welcome email
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: user.email,
    subject: 'Welcome to Our Platform',
    text: `Hello ${user.email}, welcome to our platform!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      done(new Error('Failed to send email'));
    } else {
      console.log(`Email sent: ${info.response}`);
      done();
    }
  });
});

