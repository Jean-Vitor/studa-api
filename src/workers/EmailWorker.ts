import Bull from 'bull';
import { createTransport, Transporter } from 'nodemailer';
import { SMTP_FROM, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER } from '../constants/enviroment';
import renderTemplate, { TemplateKey } from '../templates';
import redisClient from '../config/redis';

interface EmailJobData {
  to: string;
  subject: string;
  templateKey: TemplateKey;
  data: any;
}

class EmailWorker {
  private queue: Bull.Queue<EmailJobData>;
  private transport: Transporter;

  constructor() {
    this.queue = new Bull('email', { redis: redisClient });

    this.transport = createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    this.queue.process(async (job) => {
      const {
        to,
        subject,
        templateKey,
        data
      } = job.data;

      const template = renderTemplate(templateKey, data);
      console.log('sending email ', templateKey, 'to', to);
      try {
        await this.transport.sendMail({
          from: SMTP_FROM,
          to,
          subject,
          html: template,
        });
        console.log('email sent ', templateKey, 'to', to);
      } catch (error) {
        // Log the error and/or retry the job
        console.error('Error sending email', error);
        throw error;
      }
    });
  }

  async sendEmail(to: string, subject: string, templateKey: TemplateKey, data: any) {
    await this.queue.add({
      to,
      subject,
      templateKey,
      data,
    });
  }
}

export default new EmailWorker();
