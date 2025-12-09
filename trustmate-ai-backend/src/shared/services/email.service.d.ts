import { ConfigService } from '@nestjs/config';
export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    private defaultFrom;
    constructor(configService: ConfigService);
    private initializeTransporter;
    sendPasswordResetEmail(email: string, token: string): Promise<boolean>;
    sendEmail(mailOptions: MailOptions): Promise<boolean>;
    sendVerificationEmail(email: string, token: string): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string): Promise<boolean>;
    sendCustomEmail(to: string, subject: string, html: string, text?: string): Promise<boolean>;
}
