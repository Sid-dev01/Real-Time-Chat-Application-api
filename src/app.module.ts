import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { appConfig, envValidationSchema, authConfig } from './config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig, 
        authConfig
      ],
      validationSchema: envValidationSchema,
    }),
    CommonModule,
    DrizzleModule,
    AuthModule,
  ],
})
export class AppModule {}