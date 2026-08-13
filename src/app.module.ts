import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './db/drizzle.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ChatModule } from '@modules/chat/chat.module';
import { UsersModule } from '@modules/users/users.module';
import { appConfig, envValidationSchema, authConfig } from './config';
import { FriendshipModule } from '@modules/friendship/friendship.module';

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
    FriendshipModule,
    ChatModule
  ],
})
export class AppModule {}