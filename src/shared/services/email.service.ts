// src/shared/services/email.service.ts - FIXED VERSION
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

// Define proper types for mail options
export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpConfig: SmtpConfig = {
      host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
      port: Number(this.configService.get<string>('EMAIL_PORT')) || 587,
      secure: this.configService.get<string>('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('EMAIL_USER') || '',
        pass: this.configService.get<string>('EMAIL_PASSWORD') || '',
      },
    };

    this.transporter = nodemailer.createTransport(smtpConfig);
    this.defaultFrom = `"${this.configService.get<string>('EMAIL_FROM_NAME') || 'TrustMate AI'}" <${this.configService.get<string>('EMAIL_FROM') || ''}>`;

    this.transporter.verify((error: Error | null) => {
      if (error) {
        this.logger.error('Email transporter error:', error);
      } else {
        this.logger.log('Email transporter is ready');
      }
    });
  }

  // ADD THIS METHOD - Missing from your code
  async sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const resetLink = `${this.configService.get<string>('APP_URL') || 'http://localhost:3000'}/api/auth/reset-password?token=${token}`;
    
    const mailOptions: MailOptions = {
      from: this.defaultFrom,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Reset Your Password</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
               Reset Password
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${resetLink}
          </p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <br>
          <p>Best regards,<br>TrustMate AI Team</p>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendEmail(mailOptions: MailOptions): Promise<boolean> {
    try {
      if (!mailOptions.from) {
        mailOptions.from = this.defaultFrom;
      }
      
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${mailOptions.to}: ${info.messageId}`);
      return true;
    } catch (error: unknown) {
      this.logger.error('Error sending email:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationLink = `${this.configService.get<string>('APP_URL') || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
    
    const mailOptions: MailOptions = {
      from: this.defaultFrom,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Verify Your Email Address</h2>
          <p>Hello,</p>
          <p>Thank you for registering with TrustMate AI. Please verify your email address by clicking the link below:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
               Verify Email Address
            </a>
          </p>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
            ${verificationLink}
          </p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <br>
          <p>Best regards,<br>TrustMate AI Team</p>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const mailOptions: MailOptions = {
      from: this.defaultFrom,
      to: email,
      subject: 'Welcome to TrustMate AI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to TrustMate AI, ${name}!</h2>
          <p>Thank you for joining our platform. We're excited to have you on board.</p>
          <p>Your account has been successfully created and you can now:</p>
          <ul>
            <li>Track group expenses</li>
            <li>Scan receipts with AI</li>
            <li>Simplify settlements</li>
            <li>Get spending insights</li>
          </ul>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br>
          <p>Best regards,<br>TrustMate AI Team</p>
        </div>
      `,
    };

    return this.sendEmail(mailOptions);
  }

  async sendCustomEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
    const mailOptions: MailOptions = {
      from: this.defaultFrom,
      to,
      subject,
      html,
      text,
    };
    
    return this.sendEmail(mailOptions);
  }
}