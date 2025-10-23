import Joi from "joi";

export const authoriseObjectId = (req, res, next, val) => {
  const schema = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required();

  const { error } = schema.validate(val);

  if (error) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID format",
    });
  }

  next();
};
