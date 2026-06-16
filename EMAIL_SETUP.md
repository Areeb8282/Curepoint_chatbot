# Email Configuration Setup

To enable appointment confirmation emails, follow these steps:

## Gmail Setup (Recommended)

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer" (or Other)
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file**:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

4. **Restart the backend server**

## Alternative: Use Other Email Services

### Outlook/Hotmail
```javascript
service: 'hotmail'
```

### Yahoo
```javascript
service: 'yahoo'
```

### Custom SMTP
```javascript
host: 'smtp.example.com',
port: 587,
secure: false,
auth: {
  user: 'your-email',
  pass: 'your-password'
}
```

## Testing

After configuration, when a user books an appointment:
- They enter their email address
- The system sends a confirmation email with appointment details
- The email includes doctor name, hospital, date, and time

## Troubleshooting

If emails are not sending:
1. Check that EMAIL_USER and EMAIL_PASSWORD are set correctly in .env
2. Verify 2-Step Verification is enabled for Gmail
3. Make sure you're using an App Password, not your regular Gmail password
4. Check backend console for error messages
5. Restart the backend server after changing .env
