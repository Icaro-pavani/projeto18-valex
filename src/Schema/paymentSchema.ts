import Joi from "joi";

const paymentSchema = Joi.object({
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
  cardPassword: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});

export default paymentSchema;
