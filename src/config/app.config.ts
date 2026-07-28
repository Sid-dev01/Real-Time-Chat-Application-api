import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
        name: process.env.APP_NAME,
        host: process.env.HOST,
        port: Number(process.env.PORT),
        nodeEnv: process.env.NODE_ENV
}))