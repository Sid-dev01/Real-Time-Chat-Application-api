import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle.module';
import { AuthModule } from './modules/auth/auth.module';
import { appConfig, envValidationSchema } from './config';
import { CommonModule } from './common/services/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: envValidationSchema,
    }),
    CommonModule,
    DrizzleModule,
    AuthModule,
  ],
})
export class AppModule {}