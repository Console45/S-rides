import Joi from "joi";

export const editProfileSchema = Joi.object().keys({
  name: Joi.string(),
  email: Joi.string().email(),
});

export const editPasswordSchema = Joi.object().keys({
  current_password: Joi.string().required(),
  new_password: Joi.string().required(),
});

export const getUsersSchema = Joi.object().keys({
  name: Joi.string(),
});

export const editPhoneSchema = Joi.object().keys({
  code: Joi.string().required(),
  phone: Joi.object()
    .keys({
      id: Joi.string(),
      number: Joi.string().required(),
      primary: Joi.boolean().required(),
    })
    .required(),
});
