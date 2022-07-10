import Joi from "joi";

const onlinePaymentSchema = Joi.object({
  cardNumber: Joi.string()
    .pattern(/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
    .required(),
  ownerName: Joi.string().required(),
  expirationDate: Joi.string()
    .pattern(/^(0[0-9]|1[0-2])\/([0-9]{2})$/)
    .required(),
  cvc: Joi.string()
    .pattern(/^[0-9]{3}$/)
    .required(),
  amount: Joi.number().integer().greater(0).required(),
});

export default onlinePaymentSchema;
