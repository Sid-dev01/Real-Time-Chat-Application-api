import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { FriendshipService } from './friendship.service';
import { FriendshipController } from './friendship.controller';
import { FriendshipRepository } from './friendship.repository';

@Module({
    imports: [
        AuthModule,
    ],
    controllers: [FriendshipController],
    providers: [
        FriendshipService,
        FriendshipRepository,
    ],
})

export class FriendshipModule {}