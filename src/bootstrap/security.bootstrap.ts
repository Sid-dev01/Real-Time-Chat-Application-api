import helmet from '@fastify/helmet';
import { NestFastifyApplication } from "@nestjs/platform-fastify";

export async function setUpSecurity(
    app: NestFastifyApplication,
): Promise<void> {
    await app.register(helmet);
}