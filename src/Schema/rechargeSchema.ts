import Joi from "joi";

const rechargeSchema = Joi.object({
  amount: Joi.number().integer().greater(0).required(),
});

export default rechargeSchema;
