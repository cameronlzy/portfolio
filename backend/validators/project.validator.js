import Joi from "joi"
import { PROJECT_TYPES } from "../constants/projectTypes.js"

export const validateProject = (project) => {
  const linkSchema = Joi.object({
    type: Joi.string().trim().required().messages({
      "any.required": "Link type is required",
      "string.base": "Link type must be a string",
      "string.empty": "Link type cannot be empty",
    }),
    inSite: Joi.boolean().default(false).messages({
      "boolean.base": "Value must be true or false",
      "any.required": "This field is required",
    }),
    url: Joi.alternatives().conditional("inSite", {
      is: true,
      then: Joi.string().allow("").messages({
        "string.base": "URL must be a string",
      }),
      otherwise: Joi.string()
        .uri({ scheme: ["http", "https"] })
        .required()
        .messages({
          "any.required": "URL is required when inSite is false",
          "string.uri": "URL must be a valid HTTP/HTTPS link",
        }),
    }),
  })

  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "any.required": "A project must have a name",
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must have at least 3 characters",
      "string.max": "Name must have at most 100 characters",
    }),
    description: Joi.string().min(3).max(200).required().messages({
      "any.required": "A project must have a description",
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must have at least 3 characters",
      "string.max": "Description must have at most 200 characters",
    }),
    type: Joi.string()
      .valid(...PROJECT_TYPES)
      .required()
      .messages({
        "any.required": "A project must have a type",
        "any.only": `Type must be one of: ${PROJECT_TYPES.join(", ")}`,
        "string.base": "Type must be a string",
        "string.empty": "Type cannot be empty",
      }),
    links: Joi.array().items(linkSchema).max(3).messages({
      "array.max": "A project cannot have more than 3 links",
    }),
    tags: Joi.array()
      .items(
        Joi.string().trim().messages({
          "string.base": "Each tag must be a string",
          "string.empty": "Tag cannot be empty",
        })
      )
      .max(15)
      .messages({
        "array.max": "A project cannot have more than 15 tags",
      }),
  })

  return schema.validate(project)
}

export const validateProjectPatch = (update) => {
  const linkSchema = Joi.object({
    type: Joi.string().trim().messages({
      "string.base": "Link type must be a string",
      "string.empty": "Link type cannot be empty",
    }),
    inSite: Joi.boolean().default(false).messages({
      "boolean.base": "Value must be true or false",
    }),
    url: Joi.alternatives().conditional("inSite", {
      is: true,
      then: Joi.string().allow("").messages({
        "string.base": "URL must be a string",
      }),
      otherwise: Joi.string()
        .uri({ scheme: ["http", "https"] })
        .required()
        .messages({
          "any.required": "URL is required when inSite is false",
          "string.uri": "URL must be a valid HTTP/HTTPS link",
        }),
    }),
  })

  const schema = Joi.object({
    name: Joi.string().min(3).max(100).messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must have at least 3 characters",
      "string.max": "Name must have at most 100 characters",
    }),
    description: Joi.string().min(3).max(200).messages({
      "string.base": "Description must be a string",
      "string.empty": "Description cannot be empty",
      "string.min": "Description must have at least 3 characters",
      "string.max": "Description must have at most 200 characters",
    }),
    type: Joi.string()
      .valid(...PROJECT_TYPES)
      .messages({
        "any.only": `Type must be one of: ${PROJECT_TYPES.join(", ")}`,
        "string.base": "Type must be a string",
        "string.empty": "Type cannot be empty",
      }),
    links: Joi.array().items(linkSchema).max(3).messages({
      "array.max": "A project cannot have more than 3 links",
    }),
    tags: Joi.array()
      .items(
        Joi.string().trim().messages({
          "string.base": "Each tag must be a string",
          "string.empty": "Tag cannot be empty",
        })
      )
      .max(15)
      .messages({
        "array.max": "A project cannot have more than 15 tags",
      }),
  }).min(1)

  return schema.validate(update)
}

export const validateLink = (update, currentInSite = false) => {
  const effectiveInSite = Object.prototype.hasOwnProperty.call(update, "inSite")
    ? update.inSite
    : currentInSite

  const schema = Joi.object({
    type: Joi.string().trim().messages({
      "string.base": "Link type must be a string",
      "string.empty": "Link type cannot be empty",
    }),
    inSite: Joi.boolean().messages({
      "boolean.base": "Value must be true or false",
    }),
    url: effectiveInSite
      ? Joi.string().allow("").messages({
          "string.base": "URL must be a string",
        })
      : Joi.string()
          .uri({ scheme: ["http", "https"] })
          .messages({
            "string.uri": "URL must be a valid HTTP/HTTPS link",
          }),
  }).min(1)

  return schema.validate(update)
}
