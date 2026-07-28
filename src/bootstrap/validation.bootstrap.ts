import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';

export function setUpValidation(app: INestApplication) {
    app.useGlobalPipes(
        new ValidationPipe({
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
          whitelist: true,
          forbidNonWhitelisted: true,
        })
    )
}