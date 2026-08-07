import { 
    IsString,
    Length,
    Matches,
} from 'class-validator';

export class UpdateProfileRequestDto {
    @IsString()
    @Length(2, 50)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers and underscores.'})
    username!: string;
}