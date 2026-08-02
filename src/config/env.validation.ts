import * as Joi from 'joi';


export const envValidationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .required(),

    APP_NAME: Joi.string().required(),

    HOST: Joi.string().required(),

    PORT: Joi.number().required(),

    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(14).required(),

    JWT_ACCESS_SECRET: Joi.string().required(),

    JWT_ACCESS_EXPIRES_IN: Joi.string().required(),

    JWT_REFRESH_SECRET: Joi.string().required(),

    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
})