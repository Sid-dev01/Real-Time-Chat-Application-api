import {
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class SearchUserRequestDto {
    @IsOptional()
    @IsString()
    @Length(2, 30)
    query!: string;
}