import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { winstonConfig } from '@config/logger';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create(AppModule, { logger });
  app.useGlobalPipes(new ValidationPipe()); //
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Api MeFormei')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
