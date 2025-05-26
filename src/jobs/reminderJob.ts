import cron from 'node-cron';
import Task from '../models/Task';
import { transporter } from '../utils/mailer';

cron.schedule('0 * * * *', async () => {
  console.log('Checking for upcoming task reminders...');

  const now = new Date();
  const tasks = await Task.find({
    reminderAt: { $lte: now },
    status: { $ne: 'completed' },
  }).populate('assignedTo');

  for (const task of tasks) {
    const user = task.assignedTo as any;

    if (user?.email) {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: user.email,
        subject: `Reminder: ${task.title}`,
        text: `You have a task "${task.title}" due soon.\n\nDescription: ${task.description}`,
      });

      console.log(`Reminder sent to ${user.email} for task: ${task.title}`);
    }
  }
});
