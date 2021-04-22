import { ObjectSchema, string } from 'joi';
import * as Joi from 'joi';

export const authUserSchema: ObjectSchema = Joi.object({
  email: string().email().required(),
  password: string().min(6).max(36).required(), //.alphanum()
});
