import { createHash, timingSafeEqual } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenHashService {
  hash(token: string): string {
    return createHash('sha256')
      .update(token)
      .digest('hex');
  }

  verify(token: string, storedHash: string): boolean {
    const incomingHash = this.hash(token);

    return timingSafeEqual(
      Buffer.from(incomingHash),
      Buffer.from(storedHash),
    );
  }
}