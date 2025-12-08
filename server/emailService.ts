import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import nodemailer from "nodemailer";

// Make MailerSend optional - use Gmail fallback if not configured
const mailerSend = process.env.MAILERSEND_API_TOKEN
  ? new MailerSend({
    apiKey: process.env.MAILERSEND_API_TOKEN,
  })
  : null;

// Gmail Transporter
const gmailTransporter = process.env.GMAIL_USERNAME && process.env.GMAIL_APP_PASSWORD
  ? nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
  : null;

interface WelcomeEmailParams {
  to: string;
  firstName: string;
}

export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<boolean> {
  // Try MailerSend first
  if (mailerSend) {
    try {
      const sentFrom = new Sender("developers@sukusuku.ai", "The Developer Team @SukuSuku.ai");
      const recipients = [new Recipient(params.to, params.firstName)];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setReplyTo(sentFrom)
        .setSubject("🚀 Welcome to SukuSuku.ai — Let's Create Stories That Matter!")
        .setHtml(getWelcomeEmailHtml(params.firstName))
        .setText(getWelcomeEmailText(params.firstName));

      await mailerSend.email.send(emailParams);
      console.log(`Welcome email sent successfully to ${params.to} via MailerSend`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email via MailerSend:', error);
      // Fallthrough to Gmail if configured
    }
  }

  // Try Gmail
  if (gmailTransporter) {
    try {
      await gmailTransporter.sendMail({
        from: '"The Developer Team @SukuSuku.ai" <' + process.env.GMAIL_USERNAME + '>',
        to: params.to,
        subject: "🚀 Welcome to SukuSuku.ai — Let's Create Stories That Matter!",
        html: getWelcomeEmailHtml(params.firstName),
        text: getWelcomeEmailText(params.firstName),
      });
      console.log(`Welcome email sent successfully to ${params.to} via Gmail`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email via Gmail:', error);
      return false;
    }
  }

  console.log('No email service configured (MailerSend or Gmail), skipping email send');
  return false;
}

export async function sendNotificationEmail(subject: string, message: string): Promise<boolean> {
  // Try MailerSend first
  if (mailerSend) {
    try {
      const sentFrom = new Sender("developers@sukusuku.ai", "SukuSuku.ai System");
      const recipients = [new Recipient("developers@sukusuku.ai", "Developer Team")];

      const emailParams = new EmailParams()
        .setFrom(sentFrom)
        .setTo(recipients)
        .setSubject(subject)
        .setHtml(getNotificationEmailHtml(subject, message))
        .setText(message);

      await mailerSend.email.send(emailParams);
      return true;
    } catch (error) {
      console.error('Failed to send notification email via MailerSend:', error);
      // Fallthrough
    }
  }

  // Try Gmail
  if (gmailTransporter) {
    try {
      await gmailTransporter.sendMail({
        from: '"SukuSuku.ai System" <' + process.env.GMAIL_USERNAME + '>',
        to: "developers@sukusuku.ai", // Sending to self/admin
        subject: subject,
        html: getNotificationEmailHtml(subject, message),
        text: message,
      });
      return true;
    } catch (error) {
      console.error('Failed to send notification email via Gmail:', error);
      return false;
    }
  }

  console.log('No email service configured, skipping notification email');
  return false;
}

// Helper functions for HTML content to keep code clean and reusable

function getWelcomeEmailHtml(firstName: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SukuSuku.ai</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          color: #F40009;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .content {
          font-size: 16px;
          line-height: 1.7;
        }
        .highlight {
          color: #F40009;
          font-weight: 600;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SukuSuku.ai</div>
          <p style="color: #666; margin: 0;">A proud product of AI Masters World</p>
        </div>
        
        <div class="content">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${firstName},</h2>
          
          <p><strong>Welcome aboard!</strong><br>
          We're thrilled to have you join us on this creative journey at SukuSuku.ai, a proud product of <span class="highlight">AI Masters World</span>.</p>
          
          <p>This platform was built with a deep passion for storytelling — for authors, filmmakers, content creators, and dreamers like you who are ready to bring ideas to life using the power of AI.</p>
          
          <p>We've worked tirelessly to build a space that makes writing stories, novels, scripts, and concepts easier, faster, and more fun. And this is just the beginning! We're constantly evolving to become the world's go-to AI platform for creative writing and storytelling.</p>
          
          <p><strong>Your thoughts matter more than you know.</strong> If you have ideas, suggestions, or even a feature you'd love to see — just hit reply. We're always listening.</p>
          
          <p>Thank you for trusting us with your stories.<br>
          Now go ahead — create something amazing.</p>
          
          <p style="margin-top: 30px;"><strong>Let's SukuSuku. 🚀</strong></p>
          
          <p style="margin-top: 30px;">
            Warmly,<br>
            <span class="highlight">The Developer Team</span><br>
            @sukusuku.ai
          </p>
        </div>
        
        <div class="footer">
          <p><small>Communication will be monitored by developers team and management through this email: developers@sukusuku.ai</small></p>
          <p><small>You received this email because you signed up for SukuSuku.ai. This is a one-time welcome message.</small></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getWelcomeEmailText(firstName: string): string {
  return `
Hi ${firstName},

Welcome aboard!
We're thrilled to have you join us on this creative journey at SukuSuku.ai, a proud product of AI Masters World.

This platform was built with a deep passion for storytelling — for authors, filmmakers, content creators, and dreamers like you who are ready to bring ideas to life using the power of AI.

We've worked tirelessly to build a space that makes writing stories, novels, scripts, and concepts easier, faster, and more fun. And this is just the beginning! We're constantly evolving to become the world's go-to AI platform for creative writing and storytelling.

Your thoughts matter more than you know. If you have ideas, suggestions, or even a feature you'd love to see — just hit reply. We're always listening.

Thank you for trusting us with your stories.
Now go ahead — create something amazing.

Let's SukuSuku. 🚀

Warmly,
The Developer Team
@sukusuku.ai

---
Communication will be monitored by developers team and management through this email: developers@sukusuku.ai
You received this email because you signed up for SukuSuku.ai. This is a one-time welcome message.
  `;
}

function getNotificationEmailHtml(subject: string, message: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #F40009;">${subject}</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        ${message}
      </div>
      <p style="color: #666; font-size: 14px;">
        This is an automated notification from SukuSuku.ai system.
      </p>
    </div>
  `;
}