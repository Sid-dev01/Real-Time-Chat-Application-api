import { 
    IsEmail, 
    IsMobilePhone,
    IsOptional,
    IsString, 
    Length, 
    Matches 
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @Length(3, 20)
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores.',
    })
    username!: string;

    @IsOptional()
    @IsEmail()
    email!: string;

    @IsOptional()
    @IsMobilePhone('en-IN')
    mobile!: string;

    @IsString()
    @Length(8, 20)
    password!: string;
}