import postgres from 'postgres';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';

@Injectable()
export class DrizzleService {
    readonly db;

    constructor(private readonly configService: ConfigService) {
        const client = postgres(
            this.configService.getOrThrow<string>('app.databaseUrl')
        )
        this.db = drizzle(client);
    }

}