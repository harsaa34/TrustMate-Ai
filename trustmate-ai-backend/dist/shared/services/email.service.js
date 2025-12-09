"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    defaultFrom;
    constructor(configService) {
        this.configService = configService;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const smtpConfig = {
            host: this.configService.get('EMAIL_HOST') || 'smtp.gmail.com',
            port: Number(this.configService.get('EMAIL_PORT')) || 587,
            secure: this.configService.get('EMAIL_SECURE') === 'true',
            auth: {
                user: this.configService.get('EMAIL_USER') || '',
                pass: this.configService.get('EMAIL_PASSWORD') || '',
            },
        };
        this.transporter = nodemailer.createTransport(smtpConfig);
        this.defaultFrom = `"${this.configService.get('EMAIL_FROM_NAME') || 'TrustMate AI'}" <${this.configService.get('EMAIL_FROM') || ''}>`;
        this.transporter.verify((error) => {
            if (error) {
                this.logger.error('Email transporter error:', error);
            }
            else {
                this.logger.log('Email transporter is ready');
            }
        });
    }
    async sendPasswordResetEmail(email, token) {
        const resetLink = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/api/auth/reset-password?token=${token}`;
        const mailOptions = {
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
    async sendEmail(mailOptions) {
        try {
            if (!mailOptions.from) {
                mailOptions.from = this.defaultFrom;
            }
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email sent to ${mailOptions.to}: ${info.messageId}`);
            return true;
        }
        catch (error) {
            this.logger.error('Error sending email:', error);
            return false;
        }
    }
    async sendVerificationEmail(email, token) {
        const verificationLink = `${this.configService.get('APP_URL') || 'http://localhost:3000'}/api/auth/verify-email?token=${token}`;
        const mailOptions = {
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
    async sendWelcomeEmail(email, name) {
        const mailOptions = {
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
    async sendCustomEmail(to, subject, html, text) {
        const mailOptions = {
            from: this.defaultFrom,
            to,
            subject,
            html,
            text,
        };
        return this.sendEmail(mailOptions);
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map