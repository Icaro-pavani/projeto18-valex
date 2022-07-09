import Joi from "joi";

const typeSchema = Joi.object({
  type: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export default typeSchema;
