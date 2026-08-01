import postgres from 'postgres';
import * as schema from './schema';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class DrizzleService {
    private readonly db: PostgresJsDatabase<typeof schema>;

    constructor(private readonly configService: ConfigService) {
        const client = postgres(
            this.configService.getOrThrow<string>('app.databaseUrl'),
            {
                max: 10
            }
        )
        this.db = drizzle(client, { schema});
    }

    get database(): PostgresJsDatabase<typeof schema> {
        return this.db;
    }

}