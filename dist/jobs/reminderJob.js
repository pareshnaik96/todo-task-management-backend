"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const Task_1 = __importDefault(require("../models/Task"));
const mailer_1 = require("../utils/mailer");
node_cron_1.default.schedule('0 * * * *', async () => {
    console.log('Checking for upcoming task reminders...');
    const now = new Date();
    const tasks = await Task_1.default.find({
        reminderAt: { $lte: now },
        status: { $ne: 'completed' },
    }).populate('assignedTo');
    for (const task of tasks) {
        const user = task.assignedTo;
        if (user?.email) {
            await mailer_1.transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: user.email,
                subject: `Reminder: ${task.title}`,
                text: `You have a task "${task.title}" due soon.\n\nDescription: ${task.description}`,
            });
            console.log(`Reminder sent to ${user.email} for task: ${task.title}`);
        }
    }
});
