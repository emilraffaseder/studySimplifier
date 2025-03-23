const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send an email notification
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} text - plain text content
 * @param {string} html - html content
 * @returns {Promise} - nodemailer send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Study Simplifier" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    };

    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

/**
 * Send a notification about a due task
 * @param {Object} user - user object
 * @param {Object} task - todo/task object
 */
const sendTaskDueNotification = async (user, task) => {
  if (!user.notifications?.email?.enabled || !user.notifications?.email?.dueTasks) {
    return null;
  }

  const dueDate = new Date(task.dueDate).toLocaleDateString();
  const subject = `Erinnerung: Aufgabe "${task.title}" ist fällig`;
  
  const text = `Hallo ${user.firstName},

Deine Aufgabe "${task.title}" ist am ${dueDate} fällig.

Melde dich in Study Simplifier an, um die Aufgabe zu bearbeiten:
http://localhost:3000/tasks

Viele Grüße,
Dein Study Simplifier Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #67329E; color: white; padding: 20px; text-align: center;">
        <img src="http://localhost:3000/icons/LogoStudySimplifier.png" alt="Study Simplifier Logo" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h1>Aufgabenerinnerung</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Hallo ${user.firstName},</p>
        <p>Deine Aufgabe <strong>"${task.title}"</strong> ist am <strong>${dueDate}</strong> fällig.</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="http://localhost:3000/tasks" 
             style="background-color: #67329E; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Aufgabe ansehen
          </a>
        </div>
        <p>Viele Grüße,<br>Dein Study Simplifier Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>
          Um Benachrichtigungen zu deaktivieren, gehe zu 
          <a href="http://localhost:3000/settings">Einstellungen</a>.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
};

/**
 * Send a notification about new features
 * @param {Object} user - user object
 * @param {string} featureTitle - title of new feature
 * @param {string} featureDescription - description of new feature
 */
const sendNewFeatureNotification = async (user, featureTitle, featureDescription) => {
  if (!user.notifications?.email?.enabled || !user.notifications?.email?.newFeatures) {
    return null;
  }

  const subject = `Neue Funktion: ${featureTitle}`;
  
  const text = `Hallo ${user.firstName},

Study Simplifier hat eine neue Funktion: ${featureTitle}

${featureDescription}

Melde dich an, um sie auszuprobieren:
http://localhost:3000

Viele Grüße,
Dein Study Simplifier Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #67329E; color: white; padding: 20px; text-align: center;">
        <img src="http://localhost:3000/icons/LogoStudySimplifier.png" alt="Study Simplifier Logo" style="width: 60px; height: 60px; margin-bottom: 10px;" />
        <h1>Neue Funktion</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Hallo ${user.firstName},</p>
        <p>Study Simplifier hat eine neue Funktion: <strong>${featureTitle}</strong></p>
        <p>${featureDescription}</p>
        <div style="margin: 25px 0; text-align: center;">
          <a href="http://localhost:3000" 
             style="background-color: #67329E; color: white; padding: 10px 20px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Jetzt ausprobieren
          </a>
        </div>
        <p>Viele Grüße,<br>Dein Study Simplifier Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>
          Um Benachrichtigungen zu deaktivieren, gehe zu 
          <a href="http://localhost:3000/settings">Einstellungen</a>.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
};

module.exports = {
  sendEmail,
  sendTaskDueNotification,
  sendNewFeatureNotification
}; 