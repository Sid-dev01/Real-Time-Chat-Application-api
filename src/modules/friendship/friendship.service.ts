import { 
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { 
    getUserLowHighId,
    generateId,
} from '@common/utils';
import { FriendRequestResponseDto } from './dto';
import { SuccessResponse } from '@common/responses';
import { FriendRequestStatus } from '@common/constants';
import { FriendshipRepository } from './friendship.repository';
import { AuthRepository } from '@modules/auth/auth/auth.repository';


@Injectable()
export class FriendshipService {
    constructor(
        private readonly friendshipRepository: FriendshipRepository,
        private readonly authRepository: AuthRepository,
    ) {}

    async sendFriendRequest(
        senderId: string,
        receiverId: string,
    ): Promise<SuccessResponse<FriendRequestResponseDto>> {
        if(senderId === receiverId) {
            throw new BadRequestException("You cannot send a friend request to yourself.");    
        }

        const reciever = await this.authRepository.findById(receiverId);

        if(!reciever) {
            throw new NotFoundException("User not found.");
        }

        const { userLowId, userHighId } = getUserLowHighId(senderId, receiverId);

        const existingRelationship = await this.friendshipRepository.findActiveRelationship(userLowId, userHighId);

        if(existingRelationship.length > 0) {
            throw new ConflictException(
                existingRelationship[0].friendshipStatus ===
                FriendRequestStatus.PENDING
                    ? "Friend Request already exists."
                    : "You are already friends."
            );
        }

        const [ friendRequest ] = await this.friendshipRepository.createFriendshipRequest({
            id: generateId(),
            senderId,
            receiverId,
            userLowId,
            userHighId,
        });

        const response: FriendRequestResponseDto = {
            id: friendRequest.id,
            senderId: friendRequest.senderId,
            recieverId: friendRequest.recieverId,
            status: FriendRequestStatus[friendRequest.friendshipStatus],
            createdAt: friendRequest.createdAt,
        }

        return new SuccessResponse(
            response,
            'Friend request sent successfully.'
        )
    }
}