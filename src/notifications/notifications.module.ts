import { Module, Optional } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationsService } from './notifications.service';
import * as path from 'path';

const getMailerConfig = (configService: ConfigService) => {
  const mailUser = configService.get('MAIL_USER');
  const mailPassword = configService.get('MAIL_PASSWORD');

  return {
    transport: {
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: mailUser,
        pass: mailPassword,
      },
    },
    defaults: {
      from: `"Flight Reservation" <${configService.get('MAIL_FROM')}>`,
    },
    template: {
      dir: path.join(__dirname, 'templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};

function getMailerModuleImports() {
  const mailUser = process.env.MAIL_USER;
  const mailPassword = process.env.MAIL_PASSWORD;
  const mailEnabled = process.env.MAIL_ENABLED !== 'false';

  if (mailEnabled && mailUser && mailPassword) {
    return [
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: getMailerConfig,
        inject: [ConfigService],
      }),
    ];
  }

  // Return empty array if mail is disabled - MailerModule won't be loaded
  console.warn('⚠️  Email service disabled. Set MAIL_ENABLED=true and provide credentials to enable.');
  return [];
}

@Module({
  imports: [
    ConfigModule,
    ...getMailerModuleImports(),
  ],
  providers: [
    {
      provide: NotificationsService,
      useFactory: (mailerService: MailerService | null, configService: ConfigService) => {
        const mailUser = configService.get('MAIL_USER');
        const mailPassword = configService.get('MAIL_PASSWORD');
        const mailEnabled = configService.get('MAIL_ENABLED', 'true') === 'true';

        if (!mailEnabled || !mailUser || !mailPassword || !mailerService) {
          // Return a mock service that just logs
          return {
            sendBookingConfirmation: async () => {
              console.log('📧 Email service disabled - booking confirmation email would be sent here');
            },
            sendPaymentConfirmation: async () => {
              console.log('📧 Email service disabled - payment confirmation email would be sent here');
            },
            sendFlightReminder: async () => {
              console.log('📧 Email service disabled - flight reminder email would be sent here');
            },
            sendCancellationNotification: async () => {
              console.log('📧 Email service disabled - cancellation email would be sent here');
            },
          };
        }
        return new NotificationsService(mailerService, configService);
      },
      inject: [{ token: MailerService, optional: true }, ConfigService],
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
