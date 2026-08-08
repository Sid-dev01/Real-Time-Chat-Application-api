import { Injectable } from '@nestjs/common';
import { FriendshipRepository } from './friendship.repository';

@Injectable()
export class FriendshipService {
    constructor(
        private readonly friendshipRepository: FriendshipRepository
    ) {}
}