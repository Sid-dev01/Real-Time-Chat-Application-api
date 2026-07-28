import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, envValidationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: envValidationSchema,
    })
  ],
})
export class AppModule {}