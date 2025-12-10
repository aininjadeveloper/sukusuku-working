import {
  users,
  authTokens,
  type User,
  type UpsertUser,
  type AuthToken,
  type InsertAuthToken,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined>;
  updateUserCredits(id: string, penoraCredits?: number, imagegeneCredits?: number, creditsUsedDelta?: number): Promise<User | undefined>;
  updateUserLastLogin(id: string): Promise<void>;

  // Token operations
  createAuthToken(token: InsertAuthToken): Promise<AuthToken>;
  getAuthToken(token: string): Promise<AuthToken | undefined>;
  deleteAuthToken(token: string): Promise<void>;
  deleteUserTokens(userId: string, type?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      // First try to find existing user by email or id
      let existingUser = null;
      if (userData.email) {
        [existingUser] = await db.select().from(users).where(eq(users.email, userData.email));
      }
      if (!existingUser && userData.id) {
        [existingUser] = await db.select().from(users).where(eq(users.id, userData.id));
      }

      if (existingUser) {
        // Update existing user
        const [updatedUser] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
            lastLoginAt: new Date(),
          })
          .where(eq(users.id, existingUser.id))
          .returning();
        return updatedUser;
      } else {
        // Create new user with default credits (matching schema.ts defaults)
        const [newUser] = await db
          .insert(users)
          .values({
            ...userData,
            penoraCredits: 50,
            imagegeneCredits: 50,
            totalCreditsUsed: 0,
            lastLoginAt: new Date(),
          })
          .returning();

        // Send welcome email to new users
        if (newUser.email) {
          try {
            const { sendWelcomeEmail } = await import('./emailService');
            await sendWelcomeEmail({
              to: newUser.email,
              firstName: newUser.firstName || 'Friend'
            });
            console.log('Welcome email sent to:', newUser.email);
          } catch (error) {
            console.error('Failed to send welcome email:', error);
          }
        }

        return newUser;
      }
    } catch (error) {
      console.error('Error in upsertUser:', error);
      throw error;
    }
  }

  async updateUserCredits(id: string, penoraCredits?: number, imagegeneCredits?: number, creditsUsedDelta?: number): Promise<User | undefined> {
    const updateData: any = { updatedAt: new Date() };
    if (penoraCredits !== undefined) updateData.penoraCredits = penoraCredits;
    if (imagegeneCredits !== undefined) updateData.imagegeneCredits = imagegeneCredits;

    // If we have a delta for used credits, increment the total
    if (creditsUsedDelta && creditsUsedDelta > 0) {
      updateData.totalCreditsUsed = sql`${users.totalCreditsUsed} + ${creditsUsedDelta}`;
    }

    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, updates: Partial<UpsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    try {
      const nodemailer = (await import('nodemailer')).default;

      if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_APP_PASSWORD) {
        console.log('Gmail credentials not configured for welcome email');
        return;
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const firstName = user.firstName || 'Creator';

      const mailOptions = {
        from: 'hello@sukusuku.ai',
        to: user.email,
        replyTo: 'hello@sukusuku.ai',
        subject: '🚀 Welcome to SukuSuku.ai — Let\'s Create Stories That Matter!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
              .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 50px 40px; text-align: center; }
              .logo { color: #F40009; font-size: 42px; font-weight: bold; margin-bottom: 12px; }
              .tagline { color: #F40009; font-size: 18px; margin-bottom: 10px; font-weight: 500; }
              .subtitle { color: #ccc; font-size: 14px; }
              .content { padding: 50px 40px; }
              .greeting { font-size: 28px; font-weight: bold; color: #000; margin-bottom: 25px; }
              .welcome { font-size: 20px; color: #F40009; font-weight: 600; margin-bottom: 30px; }
              .message { color: #555; margin: 25px 0; font-size: 16px; line-height: 1.8; }
              .highlight { color: #F40009; font-weight: 600; }
              .mission-box { background: linear-gradient(135deg, #f8f9fa 0%, #fff 100%); padding: 35px; margin: 35px 0; border-radius: 12px; border-left: 6px solid #F40009; }
              .mission-text { color: #444; font-size: 16px; line-height: 1.8; font-style: italic; }
              .evolution-text { background: #fff5f5; border: 2px solid #ffe0e0; padding: 25px; border-radius: 10px; margin: 30px 0; }
              .cta-section { text-align: center; margin: 40px 0; }
              .cta-text { font-size: 18px; color: #000; font-weight: 600; margin-bottom: 15px; }
              .signature { margin-top: 50px; padding-top: 30px; border-top: 2px solid #f0f0f0; }
              .signature-text { color: #666; font-size: 16px; line-height: 1.6; }
              .team { color: #F40009; font-weight: 600; font-size: 16px; }
              .footer { background: #000; color: white; padding: 40px; text-align: center; }
              .footer-logo { color: #F40009; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
              .footer-text { color: #ccc; font-size: 14px; line-height: 1.6; }
              .footer-note { background: #1a1a1a; color: #999; font-size: 12px; padding: 20px; margin-top: 20px; border-radius: 8px; }
              .rocket { font-size: 24px; margin: 0 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SukuSuku™.ai</div>
                <div class="tagline">From Script to Screen. With AI.</div>
                <div class="subtitle">A proud product of AI Masters World</div>
              </div>
              
              <div class="content">
                <div class="greeting">Hi ${firstName},</div>
                
                <div class="welcome">Welcome aboard!</div>
                
                <div class="message">
                  We're <span class="highlight">thrilled</span> to have you join us on this creative journey at <strong>SukuSuku.ai</strong>, a proud product of <strong>AI Masters World</strong>.
                </div>
                
                <div class="mission-box">
                  <div class="mission-text">
                    This platform was built with a deep passion for storytelling — for authors, filmmakers, content creators, and dreamers like you who are ready to bring ideas to life using the power of AI.
                  </div>
                </div>
                
                <div class="message">
                  We've worked tirelessly to build a space that makes writing stories, novels, scripts, and concepts <span class="highlight">easier, faster, and more fun</span>. And this is just the beginning!
                </div>
                
                <div class="evolution-text">
                  <strong>We're constantly evolving to become the world's go-to AI platform for creative writing and storytelling.</strong>
                </div>
                
                <div class="message">
                  <strong>Your thoughts matter more than you know.</strong> If you have ideas, suggestions, or even a feature you'd love to see — just hit reply. We're always listening.
                </div>
                
                <div class="message">
                  Thank you for trusting us with your stories.
                </div>
                
                <div class="cta-section">
                  <div class="cta-text">Now go ahead — create something amazing.</div>
                  <div style="font-size: 24px; color: #F40009; font-weight: bold; margin: 20px 0;">
                    Let's SukuSuku.<span class="rocket">🚀</span>
                  </div>
                </div>
                
                <div class="signature">
                  <div class="signature-text">
                    <strong>Warmly,</strong><br>
                    <div class="team">The Developer Team</div>
                    <div style="color: #999; margin-top: 10px;">@sukusuku.ai</div>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <div class="footer-logo">SukuSuku™.ai</div>
                <div class="footer-text">
                  Empowering creators worldwide through AI<br>
                  Made with ❤️ @ SukuSukuai
                </div>
                <div class="footer-note">
                  <strong>Note:</strong> Communication will be monitored by our developers team and management through developers@sukusuku.ai to ensure the best experience for our users.
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
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
Note: Communication will be monitored by our developers team and management through developers@sukusuku.ai to ensure the best experience for our users.
        `
      };

      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to new user: ${user.email}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendContactEmail(contactData: { name: string; email: string; message: string }): Promise<void> {
    try {
      const nodemailer = (await import('nodemailer')).default;

      if (!process.env.GMAIL_USERNAME || !process.env.GMAIL_APP_PASSWORD) {
        console.log('Gmail credentials not configured for contact email');
        return;
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      // Send confirmation email to user
      const userMailOptions = {
        from: 'hello@sukusuku.ai',
        to: contactData.email,
        replyTo: 'hello@sukusuku.ai',
        subject: 'Thank you for contacting SukuSuku™.ai! 🎬',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; line-height: 1.7; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
              .container { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 50px 40px; text-align: center; }
              .logo { color: #F40009; font-size: 42px; font-weight: bold; margin-bottom: 12px; }
              .tagline { color: #F40009; font-size: 18px; margin-bottom: 10px; font-weight: 500; }
              .subtitle { color: #ccc; font-size: 14px; }
              .content { padding: 50px 40px; }
              .greeting { font-size: 28px; font-weight: bold; color: #000; margin-bottom: 25px; }
              .message { color: #555; margin: 25px 0; font-size: 16px; line-height: 1.8; }
              .highlight { color: #F40009; font-weight: 600; }
              .user-message-box { background: #f8f9fa; border-left: 6px solid #F40009; padding: 25px; margin: 30px 0; border-radius: 0 12px 12px 0; }
              .user-message-title { color: #F40009; font-weight: 600; margin-bottom: 10px; }
              .user-message-text { color: #444; font-style: italic; }
              .footer { background: #000; color: white; padding: 40px; text-align: center; }
              .footer-logo { color: #F40009; font-size: 20px; font-weight: bold; margin-bottom: 15px; }
              .footer-text { color: #ccc; font-size: 14px; line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">SukuSuku™.ai</div>
                <div class="tagline">From Script to Screen. With AI.</div>
                <div class="subtitle">A proud product of AI Masters World</div>
              </div>
              
              <div class="content">
                <div class="greeting">Hi AI Masters! 👋</div>
                
                <div class="message">
                  Thank you for reaching out to <span class="highlight">SukuSuku™.ai</span>! We're thrilled to connect with creative minds like you who are passionate about transforming ideas into reality.
                </div>
                
                <div class="user-message-box">
                  <div class="user-message-title">Your Message:</div>
                  <div class="user-message-text">"${contactData.message}"</div>
                </div>
                
                <div class="message">
                  Our team has received your inquiry and will review it carefully. We'll get back to you <span class="highlight">within 24 hours</span> with a thoughtful response.
                </div>
                
                <div class="message">
                  While you wait, feel free to explore our AI-powered creative tools and see how they can enhance your storytelling journey.
                </div>
                
                <div class="message">
                  Thank you for your interest in SukuSuku™.ai!<br>
                  <strong>The Developer Team</strong><br>
                  @SukuSuku.ai
                </div>
              </div>
              
              <div class="footer">
                <div class="footer-logo">SukuSuku™.ai</div>
                <div class="footer-text">
                  From Script to Screen. With AI.<br>
                  Communication will be monitored by our developers team and management through this email: developers@sukusuku.ai
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
Hi AI Masters!

Thank you for reaching out to SukuSuku.ai! We're thrilled to connect with creative minds like you who are passionate about transforming ideas into reality.

Your Message:
"${contactData.message}"

Our team has received your inquiry and will review it carefully. We'll get back to you within 24 hours with a thoughtful response.

While you wait, feel free to explore our AI-powered creative tools and see how they can enhance your storytelling journey.

Thank you for your interest in SukuSuku.ai!

The Developer Team
@SukuSuku.ai

---
Communication will be monitored by our developers team and management through this email: developers@sukusuku.ai
        `
      };

      // Send notification email to developers
      const devMailOptions = {
        from: 'hello@sukusuku.ai',
        to: 'developers@sukusuku.ai',
        replyTo: contactData.email,
        subject: `New Contact Form Message from ${contactData.name}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .header { color: #F40009; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
              .details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { color: #333; margin-top: 5px; }
              .message-box { background: #fff; border-left: 4px solid #F40009; padding: 20px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">New Contact Form Submission</div>
              
              <div class="details">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${contactData.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value">${contactData.email}</div>
                </div>
                <div class="field">
                  <div class="label">Submitted:</div>
                  <div class="value">${new Date().toLocaleString()}</div>
                </div>
              </div>
              
              <div class="message-box">
                <div class="label">Message:</div>
                <div class="value">${contactData.message.replace(/\n/g, '<br>')}</div>
              </div>
              
              <div class="footer">
                SukuSuku.ai Contact Form System<br>
                Reply directly to this email to respond to ${contactData.name}
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Submitted: ${new Date().toLocaleString()}

Message:
${contactData.message}

---
SukuSuku.ai Contact Form System
Reply directly to this email to respond to ${contactData.name}
        `
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(userMailOptions),
        transporter.sendMail(devMailOptions)
      ]);

      console.log(`Contact emails sent: confirmation to ${contactData.email}, notification to developers`);
    } catch (error) {
      console.error('Error sending contact emails:', error);
      throw error;
    }
  }

  // Token operations
  async createAuthToken(tokenData: InsertAuthToken): Promise<AuthToken> {
    const [token] = await db.insert(authTokens).values(tokenData).returning();
    return token;
  }

  async getAuthToken(token: string): Promise<AuthToken | undefined> {
    const [tokenRecord] = await db.select().from(authTokens).where(eq(authTokens.token, token));
    return tokenRecord;
  }

  async deleteAuthToken(token: string): Promise<void> {
    await db.delete(authTokens).where(eq(authTokens.token, token));
  }

  async deleteUserTokens(userId: string, type?: string): Promise<void> {
    if (type) {
      await db.delete(authTokens).where(and(eq(authTokens.userId, userId), eq(authTokens.type, type)));
    } else {
      await db.delete(authTokens).where(eq(authTokens.userId, userId));
    }
  }
}

export const storage = new DatabaseStorage();
