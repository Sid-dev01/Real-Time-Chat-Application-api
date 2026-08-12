import { 
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';

import { 
    getUserLowHighId,
    generateId,
} from '@common/utils';

import { 
    AllFriendsResponseDto,
    FriendRequestResponseDto, 
    ReceivedFriendRequestResponseDto, 
    SentFriendRequestResponseDto
} from './dto';

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
            receiverId: friendRequest.receiverId,
            status: FriendRequestStatus[friendRequest.friendshipStatus],
            createdAt: friendRequest.createdAt,
        }

        return new SuccessResponse(
            response,
            'Friend request sent successfully.'
        )
    }

    async acceptFriendRequest(
        requestId: string,
        currentUserId: string,
    ): Promise<SuccessResponse<null>> {
        const request = await this.friendshipRepository.findFriendRequestById(requestId);

        if(!request) {
            throw new NotFoundException("Friend request not found.");
        }

        if(request.receiverId !== currentUserId) {
            throw new ForbiddenException("You cannot accept this friend request.");
        }

        if(request.friendshipStatus !== FriendRequestStatus.PENDING) {
            throw new ConflictException("The friend request is no longer pending.");
        }

        const updatedRequest = await this.friendshipRepository.updateFriendRequestStatus(requestId, FriendRequestStatus.ACCEPTED);

        return new SuccessResponse(
            null,
            'Friend request accepted successfully.'
        )
    }

    async rejectFriendRequest(
        requestId: string,
        currentUserId: string,
    ): Promise<SuccessResponse<null>> {
        const [friendRequest] = await this.friendshipRepository.findFriendRequestById(requestId);

        if(!friendRequest) {
            throw new NotFoundException("Friend request not found.");
        }

        if(friendRequest.receiverId !== currentUserId) {
            throw new ForbiddenException("You cannot reject this friend request.");
        }

        if(friendRequest.friendshipStatus !== FriendRequestStatus.PENDING) {
            throw new ConflictException(
                "The friend request is no longer pending."
            )
        }

        await this.friendshipRepository.updateFriendRequestStatus(
            requestId,
            FriendRequestStatus.REJECTED,
        )

        return new SuccessResponse(
            null,
            'Friend request rejected successfully.'
        )
    }

    async cancelFriendRequest(
        requestId: string,
        currentUserId: string,
    ): Promise<SuccessResponse<null>> {

        const [friendRequest] = await this.friendshipRepository.findFriendRequestById(requestId);

        if(!friendRequest) {
            throw new NotFoundException("Friend request not found.");
        }

        if(friendRequest.senderId !== currentUserId) {
            throw new ForbiddenException("You cannot cancel this friend request.");
        }

        if(friendRequest.friendshipStatus !== FriendRequestStatus.PENDING) {
            throw new ConflictException(
                'This friend request is no longer pending.'
            )
        }

        await this.friendshipRepository.updateFriendRequestStatus(
            requestId,
            FriendRequestStatus.CANCELLED
        )

        return new SuccessResponse(
            null,
            "Friend request cancelled successfully."
        )
    }

    async getReceivedFriendRequests(
        userId: string,
    ): Promise<SuccessResponse<ReceivedFriendRequestResponseDto[]>> {

        const requests = await this.friendshipRepository.findReceivedFriendRequests(userId);

        const response: ReceivedFriendRequestResponseDto[] = requests.map(
            request => ({
                id: request.id,
                senderId: request.senderId,
                senderUsername: request.senderUsername,
                status: FriendRequestStatus[request.friendshipStatus],
                createdAt: request.createdAt,
            })
        )

        return new SuccessResponse(
            response,
            'All frined requests fetched successfully.'
        )
    }

    async getSentFriendRequests(
        userId: string,
    ): Promise<SuccessResponse<SentFriendRequestResponseDto[]>>{

        const requests = await this.friendshipRepository.findSentFriendRequests(userId);

        const response: SentFriendRequestResponseDto[] = requests.map(
            request => ({
                id: request.id,
                receiverId: request.receiverId,
                receiverUsername: request.receiverUsername,
                status: FriendRequestStatus[request.friendshipStatus],
                createdAt: request.createdAt,
            })
        )

        return new SuccessResponse(
            response,
            'All sent friend requests fetched successfully.'
        )
    }

    async getAllFriends(
        userId: string,
    ): Promise<SuccessResponse<AllFriendsResponseDto[]>> {
        
        const friends = await this.friendshipRepository.findAllFriends(userId);

        const response: AllFriendsResponseDto[] = friends.map(
            friend => ({
                id: friend.friendId,
                username: friend.friendUsername,
                friendsSince: friend.friendsSicne
            })
        );

        return new SuccessResponse(
            response,
            'All Friends fetched successfully.'
        )
    }

    async unfriend(
        currentUserId: string,
        friendId: string,
    ): Promise<SuccessResponse<null>> {

        if(currentUserId === friendId) {
            throw new BadRequestException(
                'You cannot unfriend '
            )
        }

        const { userLowId, userHighId } = getUserLowHighId(currentUserId, friendId);

        const existingRelationship = await this.friendshipRepository.findActiveRelationship(userLowId, userHighId);

        if(existingRelationship.length === 0) {
            throw new NotFoundException('Friendship not found.')
        }

        const relationship = existingRelationship[0];

        if(
            relationship.friendshipStatus !== 
            FriendRequestStatus.ACCEPTED
        ) {
            throw new ConflictException('You are not friends with this user.')
        }

        await this.friendshipRepository.updateFriendRequestStatus(relationship.id, FriendRequestStatus.UNFRIENDED)

        return new SuccessResponse(
            null,
            'Unfriended successfully.'
        )
    }
}