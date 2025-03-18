const Todo = require('../models/Todo');
const User = require('../models/User');
const emailService = require('./emailService');

/**
 * Check for tasks due soon and send notifications
 * Intended to be run as a scheduled job
 */
const checkAndSendTaskNotifications = async () => {
  try {
    // Get all tasks due in the next 24 hours
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTasks = await Todo.find({
      dueDate: { 
        $gte: now, 
        $lte: tomorrow 
      },
      completed: false
    }).populate('user');

    console.log(`Found ${dueTasks.length} tasks due in the next 24 hours`);
    
    // Send notifications for each task
    const notificationPromises = dueTasks.map(async (task) => {
      if (!task.user) {
        console.log(`Task ${task._id} has no associated user`);
        return;
      }

      // Get the full user object to access notification settings
      const user = await User.findById(task.user._id);
      
      if (!user) {
        console.log(`User ${task.user._id} not found`);
        return;
      }

      // Skip if user has email notifications disabled
      if (!user.notifications?.email?.enabled || !user.notifications?.email?.dueTasks) {
        console.log(`User ${user._id} has email notifications disabled`);
        return;
      }
      
      console.log(`Sending notification for task "${task.title}" to ${user.email}`);
      
      // Send email notification
      return emailService.sendTaskDueNotification(user, task);
    });
    
    await Promise.all(notificationPromises);
    console.log('Task notifications processed successfully');
    
    return { success: true, tasksProcessed: dueTasks.length };
  } catch (error) {
    console.error('Error checking and sending task notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notifications about a new feature to users
 * @param {string} featureTitle - Title of the new feature
 * @param {string} featureDescription - Description of the new feature
 */
const sendNewFeatureNotifications = async (featureTitle, featureDescription) => {
  try {
    // Get all users with email notifications enabled for new features
    const users = await User.find({
      'notifications.email.enabled': true,
      'notifications.email.newFeatures': true
    });
    
    console.log(`Sending new feature notifications to ${users.length} users`);
    
    // Send notifications to each user
    const notificationPromises = users.map(async (user) => {
      return emailService.sendNewFeatureNotification(
        user, 
        featureTitle, 
        featureDescription
      );
    });
    
    await Promise.all(notificationPromises);
    console.log('New feature notifications sent successfully');
    
    return { success: true, usersNotified: users.length };
  } catch (error) {
    console.error('Error sending new feature notifications:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  checkAndSendTaskNotifications,
  sendNewFeatureNotifications
}; 