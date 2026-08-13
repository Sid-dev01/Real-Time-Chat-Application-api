import { Injectable } from '@nestjs/common';
import { DrizzleService } from '@db/drizzle.service';


@Injectable()
export class ChatRepository {
    private readonly db;

    constructor(private readonly drizzleService: DrizzleService) {
        this.db = drizzleService.database;
    }

}