import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { appConfig, envValidationSchema, authConfig } from './config';

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
    UsersModule,
  ],
})
export class AppModule {}