import Joi from "joi";

const cardInfoSchema = Joi.object({
  employeeId: Joi.number().integer().required(),
  cardPassword: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});

export default cardInfoSchema;
