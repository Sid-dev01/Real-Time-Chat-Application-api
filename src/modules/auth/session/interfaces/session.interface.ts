import { ClientInfo } from "@/common/interfaces/client-info-headers.interface";

export interface CreateSessionData extends ClientInfo{
    userId: string;
}