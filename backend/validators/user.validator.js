import Joi from "joi"

const roles = ["user", "guide", "lead-guide", "admin"]

export const validateUser = (user) => {
  const createUserSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name is required",
      "string.min": "Name must have at least 3 characters",
      "string.max": "Name must have at most 100 characters",
      "any.required": "A user must have a name",
    }),
    email: Joi.string().trim().lowercase().email().required().messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email",
      "any.required": "A user must have an email",
    }),
    description: Joi.string().min(3).max(500).required().messages({
      "any.required": "A project must have a description",
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must have at least 3 characters",
      "string.max": "Description must have at most 500 characters",
    }),
    photo: Joi.string().trim().messages({
      "string.base": "Photo must be a string",
    }),
    role: Joi.string()
      .valid(...roles)
      .default("user")
      .messages({
        "any.only": "Role must be one of: user, guide, lead-guide, admin",
      }),
    password: Joi.string().min(8).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "any.required": "A user must have a password",
    }),
    passwordConfirm: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Please confirm your password",
      }),
    github: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .required()
      .messages({
        "any.required": "Github URL is required",
        "string.uri": "Github URL must be a valid HTTP/HTTPS link",
      }),
    linkedin: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .required()
      .messages({
        "any.required": "LinkedIn URL is required",
        "string.uri": "LinkedIn URL must be a valid HTTP/HTTPS link",
      }),
    passwordChangedAt: Joi.string(),
    active: Joi.boolean().default(true),
  }).required()
  return createUserSchema.validate(user)
}

export const validateUserPatch = (user) => {
  const updateUserSchema = Joi.object({
    name: Joi.string().trim().min(3).max(100).messages({
      "string.min": "Name must have at least 3 characters",
      "string.max": "Name must have at most 100 characters",
    }),
    email: Joi.string().trim().lowercase().email().messages({
      "string.email": "Please provide a valid email",
    }),
    description: Joi.string().min(3).max(500).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must have at least 3 characters",
      "string.max": "Description must have at most 500 characters",
    }),
    photo: Joi.string().trim(),
    role: Joi.string()
      .valid(...roles)
      .messages({
        "any.only": "Role must be one of: user, guide, lead-guide, admin",
      }),
    password: Joi.string().min(8).messages({
      "string.min": "Password must be at least 8 characters",
    }),
    passwordConfirm: Joi.string().valid(Joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
    github: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .messages({
        "string.uri": "Github URL must be a valid HTTP/HTTPS link",
      }),
    linkedin: Joi.string()
      .uri({ scheme: ["http", "https"] })
      .messages({
        "string.uri": "LinkedIn URL must be a valid HTTP/HTTPS link",
      }),
    active: Joi.boolean(),
  })
    .with("password", "passwordConfirm")
    .with("passwordConfirm", "password")
    .min(1)

  return updateUserSchema.validate(user)
}

export const validateLogin = (loginUser) => {
  const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required().messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
    // treat "" as missing and fail fast
    password: Joi.string().empty("").min(8).required().messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "any.required": "Password is required",
    }),
  }).required()
  return loginSchema.validate(loginUser)
}
