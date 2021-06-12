import Joi, { ObjectSchema } from "joi";

export const registerSchema: ObjectSchema = Joi.object().keys({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  studentId: Joi.string().min(8).required(),
});

export const loginSchema: ObjectSchema = Joi.object().keys({
  studentId: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
