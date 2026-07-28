import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setUpSwagger } from './swagger/swagger.config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  if(configService.get('app.nodeEnv') !== 'production') {
    setUpSwagger(app);
  }

  await app.listen({
    port: configService.get<number>('app.port'),
    host: configService.get<string>('app.host'),
  });
}

bootstrap();