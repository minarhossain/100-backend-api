import Joi from "joi";

export const registerValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
