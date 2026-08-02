import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class PasswordService {

    private readonly saltRounds: number;
    
    constructor(private readonly configService: ConfigService) {
        this.saltRounds = this.configService.getOrThrow<number>(
            'auth.bcryptSaltRounds'
        )
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}