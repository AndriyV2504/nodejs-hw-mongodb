import Joi from 'joi';

export const verifyGoogleOAuthValidSchema = Joi.object({
  code: Joi.string().required(),
});
