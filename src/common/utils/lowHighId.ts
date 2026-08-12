export function getUserLowHighId(
    senderId: string,
    recieverId: string,
) {
    const userLowId = senderId < recieverId ? senderId : recieverId;
    const userHighId = senderId > recieverId ? senderId : recieverId;

    return { userLowId, userHighId };
}