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
 * @param {Array} attachments - array of attachments
 * @returns {Promise} - nodemailer send result
 */
const sendEmail = async ({ to, subject, text, html, attachments = [] }) => {
  try {
    const mailOptions = {
      from: `"Study Simplifier" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments
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
        <img src="cid:logo" alt="Study Simplifier Logo" style="max-width: 150px; margin-bottom: 10px;">
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
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/icons/LogoStudySimplifier.png',
        cid: 'logo'
      }
    ]
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
        <img src="cid:logo" alt="Study Simplifier Logo" style="max-width: 150px; margin-bottom: 10px;">
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
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: './public/icons/LogoStudySimplifier.png',
        cid: 'logo'
      }
    ]
  });
};

/**
 * Send verification email with code
 * @param {Object} user - user object with email and verification code
 * @returns {Promise} - nodemailer send result
 */
const sendVerificationEmail = async (user) => {
  const subject = 'Bestätige deine E-Mail-Adresse für Study Simplifier';
  
  const text = `Hallo ${user.firstName},

Vielen Dank für deine Registrierung bei Study Simplifier!

Dein Bestätigungscode: ${user.verificationCode}

Bitte gib diesen Code auf der Bestätigungsseite ein, um deine E-Mail-Adresse zu verifizieren.

Dieser Code ist 1 Stunde gültig.

Viele Grüße,
Dein Study Simplifier Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #67329E; color: white; padding: 20px; text-align: center;">
        <img src="cid:logo" alt="Study Simplifier Logo" style="max-width: 150px; margin-bottom: 10px;">
        <h1>E-Mail bestätigen</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Hallo ${user.firstName},</p>
        <p>Vielen Dank für deine Registrierung bei Study Simplifier!</p>
        <div style="margin: 25px 0; text-align: center; background-color: #f0f0f0; padding: 15px; border-radius: 4px; font-size: 24px; letter-spacing: 2px;">
          <strong>${user.verificationCode}</strong>
        </div>
        <p>Bitte gib diesen Code auf der Bestätigungsseite ein, um deine E-Mail-Adresse zu verifizieren.</p>
        <p>Dieser Code ist <strong>1 Stunde</strong> gültig.</p>
        <p>Viele Grüße,<br>Dein Study Simplifier Team</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: '../public/icons/LogoStudySimplifier.png',
        cid: 'logo'
      }
    ]
  });
};

module.exports = {
  sendEmail,
  sendTaskDueNotification,
  sendNewFeatureNotification,
  sendVerificationEmail
}; 