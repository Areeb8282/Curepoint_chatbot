const nodemailer = require('nodemailer');

// Gmail SMTP — sends to ANY email address.
// Setup: Go to https://myaccount.google.com/apppasswords
// Enable 2-Step Verification first, then generate an App Password for "Mail".
// Set GMAIL_USER and GMAIL_APP_PASSWORD in .env

function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

exports.sendAppointmentConfirmation = async (appointmentDetails) => {
  const { userEmail, doctorName, hospitalName, date, timeSlot, slotDay } = appointmentDetails;

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass ||
      gmailUser === 'your-gmail@gmail.com' ||
      gmailPass === 'your-app-password') {
    console.error('❌ Email not sent: GMAIL_USER or GMAIL_APP_PASSWORD not configured in .env');
    return { success: false, error: 'Gmail credentials not configured' };
  }

  try {
    const transporter = createTransporter();
    await transporter.verify();

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const info = await transporter.sendMail({
      from: `"CurePoint Healthcare" <${gmailUser}>`,
      to: userEmail,
      subject: `✅ Appointment Confirmed — ${slotDay || ''} ${timeSlot} | CurePoint`,
      html: `
        <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">
          <div style="max-width:600px;margin:0 auto;background:#fff;padding:30px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.1);">
            <div style="text-align:center;margin-bottom:24px;">
              <div style="background:linear-gradient(135deg,#6366f1,#06b6d4);display:inline-block;padding:12px 28px;border-radius:8px;">
                <h1 style="color:white;margin:0;font-size:24px;letter-spacing:1px;">CurePoint</h1>
              </div>
              <p style="color:#64748b;margin:8px 0 0;">Your Healthcare Assistant</p>
            </div>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin-bottom:24px;display:flex;align-items:center;gap:12px;">
              <span style="font-size:28px;">✅</span>
              <div>
                <h2 style="color:#16a34a;margin:0;font-size:18px;">Appointment Confirmed!</h2>
                <p style="color:#64748b;margin:4px 0 0;font-size:14px;">Your booking has been successfully registered.</p>
              </div>
            </div>

            <p style="color:#374151;margin-bottom:16px;">Dear Patient,</p>
            <p style="color:#374151;margin-bottom:20px;">Here are your appointment details:</p>

            <div style="background:#f8fafc;border-radius:10px;padding:20px;margin-bottom:20px;border-left:4px solid #6366f1;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:10px 0;color:#64748b;width:40%;font-size:14px;">👨‍⚕️ Doctor</td>
                  <td style="padding:10px 0;font-weight:700;color:#0f172a;font-size:14px;">${doctorName}</td>
                </tr>
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:10px 0;color:#64748b;font-size:14px;">🏥 Hospital</td>
                  <td style="padding:10px 0;font-weight:700;color:#0f172a;font-size:14px;">${hospitalName}</td>
                </tr>
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:10px 0;color:#64748b;font-size:14px;">📅 Day</td>
                  <td style="padding:10px 0;font-weight:700;color:#0f172a;font-size:14px;">${slotDay || ''}</td>
                </tr>
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:10px 0;color:#64748b;font-size:14px;">📆 Date</td>
                  <td style="padding:10px 0;font-weight:700;color:#0f172a;font-size:14px;">${formattedDate}</td>
                </tr>
                <tr style="border-top:1px solid #e2e8f0;">
                  <td style="padding:10px 0;color:#64748b;font-size:14px;">⏰ Time</td>
                  <td style="padding:10px 0;font-weight:700;color:#0f172a;font-size:14px;">${timeSlot}</td>
                </tr>
              </table>
            </div>

            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:20px;">
              <p style="margin:0;color:#92400e;font-size:13px;">⚠️ Please arrive <strong>15 minutes early</strong> and carry a valid photo ID.</p>
            </div>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;"/>
            <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
              This is an automated email from CurePoint Healthcare. Please do not reply.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`📧 Email sent to ${userEmail} | Message ID: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};
