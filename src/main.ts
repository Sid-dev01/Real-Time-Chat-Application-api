import {
  setUpFilters,
  setUpValidation,
  setUpSwagger
} from './bootstrap';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  setUpValidation(app);
  setUpFilters(app);
  if(configService.get('app.nodeEnv') !== 'production') {
    setUpSwagger(app);
  }

  await app.listen({
    port: configService.get<number>('app.port'),
    host: configService.get<string>('app.host'),
  });
}

bootstrap();