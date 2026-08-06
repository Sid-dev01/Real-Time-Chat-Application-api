import { Global, Module } from '@nestjs/common';
import { PasswordService, TokenHashService } from '@common/services';

@Global()
@Module({
    providers: [
        PasswordService,
        TokenHashService
    ],
    exports: [
        PasswordService,
        TokenHashService
    ],
})

export class CommonModule {}