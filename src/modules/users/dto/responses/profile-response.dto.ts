export class ProfileResponseDto {
    id!: string;

    username!: string;

    email!: string | null;

    mobile!: string | null;

    createdAt!: Date;

    updatedAt!: Date;
}