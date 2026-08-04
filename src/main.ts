import { 
  setUpFilters, 
  setUpValidation, 
  setUpSwagger, 
  setUpSecurity 
} from './bootstrap';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from '@common/interceptors';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);

  setUpValidation(app);
  setUpFilters(app);
  
  app.useGlobalInterceptors(new ResponseInterceptor());

  await setUpSecurity(app);
  if (configService.get('app.nodeEnv') !== 'production') {
    setUpSwagger(app);
  }

  await app.listen({
    port: configService.get<number>('app.port'),
    host: configService.get<string>('app.host'),
  });

  if (configService.get<string>('app.nodeEnv')) {
    console.log(`🚀 Server is running on http://localhost:${configService.get<number>('app.port')}`);
  }

}

bootstrap();