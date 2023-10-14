import { SendGridModule } from '@anchan828/nest-sendgrid';
import { winstonConfig } from '@config/logger';
import { LoggerInterceptor } from '@infra/http/interceptors/logger.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { resolve } from 'path';
import { AppGateway } from './app.gateway';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';
@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    WinstonModule.forRoot(winstonConfig),
    SendGridModule.forRoot({
      apikey: process.env.SENDGRID_API_KEY,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('SENDGRID_API_KEY'),
          },
        },
        defaults: {
          from: config.get('FROM_EMAIL'),
        },
        template: {
          dir: resolve(__dirname, '..', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
            extName: '.hbs',
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    AppGateway,
  ],
})
export class AppModule {}
