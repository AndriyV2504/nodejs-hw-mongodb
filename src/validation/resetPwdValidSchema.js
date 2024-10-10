import Joi from 'joi';

export const resetPwdValidSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).max(20).required(),
});
