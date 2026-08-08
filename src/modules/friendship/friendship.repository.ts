import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@db/drizzle.service';


@Injectable()
export class FriendshipRepository {
    private readonly db;

    constructor(private readonly drizzleService: DrizzleService) {
        this.db = drizzleService.database;
    }
}