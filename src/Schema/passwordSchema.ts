import Joi from "joi";

const passwordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});

export default passwordSchema;
