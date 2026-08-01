export class SuccessResponse<T> {
    constructor(
        public readonly data: T,
        public readonly message = 'Success',
    ) {}
}