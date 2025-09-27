import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

class SendGridService {
  private fromEmail = process.env.FROM_EMAIL || 'noreply@immigrationai.com';

  async sendEmail(params: EmailParams): Promise<boolean> {
    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.log("SendGrid not configured, skipping email send");
        return true; // Return true to not break the flow
      }

      await mailService.send({
        to: params.to,
        from: params.from,
        subject: params.subject,
        text: params.text,
        html: params.html,
      });
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  async sendAlert(email: string, subject: string, content: string, alertType: string): Promise<boolean> {
    const htmlContent = this.generateAlertHTML(content, alertType);
    
    return this.sendEmail({
      to: email,
      from: this.fromEmail,
      subject: subject,
      text: content,
      html: htmlContent,
    });
  }

  async sendVisaBulletinUpdate(email: string, updates: any): Promise<boolean> {
    const subject = "New Visa Bulletin Update - Immigration AI";
    const content = `
      A new Visa Bulletin has been released with the following updates:
      
      ${updates.summary}
      
      Visit your Immigration AI dashboard for detailed information.
    `;
    
    return this.sendAlert(email, subject, content, 'visa_bulletin');
  }

  async sendH1BLotteryNotification(email: string, status: string): Promise<boolean> {
    const subject = "H-1B Lottery Results Available - Immigration AI";
    const content = `
      The H-1B lottery results for the current fiscal year are now available.
      
      Status: ${status}
      
      Check your Immigration AI dashboard for more details and next steps.
    `;
    
    return this.sendAlert(email, subject, content, 'h1b_lottery');
  }

  async sendPolicyChangeNotification(email: string, policyUpdate: any): Promise<boolean> {
    const subject = `Immigration Policy Update: ${policyUpdate.title}`;
    const content = `
      A new immigration policy update has been announced:
      
      Title: ${policyUpdate.title}
      Source: ${policyUpdate.source}
      Summary: ${policyUpdate.summary}
      
      Read the full update on your Immigration AI dashboard.
    `;
    
    return this.sendAlert(email, subject, content, 'policy_changes');
  }

  private generateAlertHTML(content: string, alertType: string): string {
    const alertTypeNames = {
      visa_bulletin: 'Visa Bulletin Update',
      h1b_lottery: 'H-1B Lottery Notification',
      policy_changes: 'Policy Update'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Immigration AI Alert</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #4F94CD, #6A5ACD); color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; line-height: 1.6; color: #333; }
          .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; background-color: #4F94CD; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .disclaimer { background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 10px; margin: 15px 0; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛂 Immigration AI</h1>
            <h2>${alertTypeNames[alertType] || 'Immigration Alert'}</h2>
          </div>
          <div class="content">
            <p>${content.replace(/\n/g, '</p><p>')}</p>
            
            <div class="disclaimer">
              <strong>⚠️ Important Legal Notice:</strong> This information is for general guidance only and is not legal advice. 
              Immigration law is complex and fact-specific. For legal advice regarding your specific situation, 
              consult with a qualified immigration attorney.
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://immigrationai.replit.app'}" class="button">
                View Dashboard
              </a>
            </p>
          </div>
          <div class="footer">
            <p>This email was sent by Immigration AI Assistant</p>
            <p>You are receiving this because you subscribed to immigration alerts</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Manage Preferences</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const sendgridService = new SendGridService();
