/**
 * Generates the styled HTML email body for a new portfolio contact submission.
 * This is the "View" layer for the email notification.
 */
const contactEmailTemplate = ({ name, email, message, dateSubmitted }) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; background-color: #f9f9fb; margin: 0; padding: 40px 20px; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; border-top: 5px solid #B600A8; box-shadow: 0 4px 20px rgba(0,0,0,0.03); overflow: hidden; }
    .header { padding: 32px 40px 20px 40px; }
    .logo { font-size: 20px; font-weight: 800; color: #0c0c0c; letter-spacing: 2px; text-transform: uppercase; font-family: sans-serif; }
    .logo-dot { color: #B600A8; }
    .content { padding: 20px 40px 32px 40px; color: #1f2937; line-height: 1.6; }
    .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; letter-spacing: -0.025em; font-family: sans-serif; }
    .intro { font-size: 15px; color: #4b5563; margin-bottom: 28px; }
    .detail-card { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 28px; }
    .field { margin-bottom: 18px; }
    .field:last-child { margin-bottom: 0; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #B600A8; margin-bottom: 4px; display: block; font-family: sans-serif; }
    .value { font-size: 14px; color: #1f2937; font-weight: 500; }
    .message-box { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin-top: 8px; font-style: italic; color: #334155; }
    .button-container { text-align: left; margin-bottom: 28px; }
    .btn { display: inline-block; background-color: #B600A8; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 0 4px 12px rgba(182,0,168,0.2); }
    .footer { padding: 24px 40px; background-color: #fafbfc; border-top: 1px solid #e5e7eb; }
    .footer-text { font-size: 13px; color: #4b5563; margin-bottom: 16px; }
    .footer-signature { font-size: 14px; font-weight: 600; color: #1f2937; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="logo">ADITYA<span class="logo-dot">.</span></div>
    </div>
    <div class="content">
      <h2 class="title">New Message Received!</h2>
      <p class="intro">A user has filled out your portfolio contact form. Details and message parameters are shown below.</p>
      
      <div class="detail-card">
        <div class="field">
          <span class="label">Sender Name</span>
          <span class="value">${name}</span>
        </div>
        <div class="field">
          <span class="label">Sender Email</span>
          <span class="value">${email}</span>
        </div>
        <div class="field">
          <span class="label">Date Submitted</span>
          <span class="value">${dateSubmitted}</span>
        </div>
        <div class="field">
          <span class="label">Message Details</span>
          <div class="message-box">"${message}"</div>
        </div>
      </div>
      
      <div class="button-container">
        <a href="mailto:${email}" class="btn">Reply to sender</a>
      </div>
    </div>
    <div class="footer">
      <div class="footer-text">Having trouble or need assistance with portfolio integrations? <a href="mailto:${process.env.GMAIL_USER}" style="color:#B600A8; text-decoration:none; font-weight:500;">Contact us</a></div>
      <div class="footer-signature">Best,<br>~ Aditya Portfolio System</div>
    </div>
  </div>
</body>
</html>`;
};

module.exports = { contactEmailTemplate };
