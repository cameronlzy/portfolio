import mongoose from "mongoose"
import { PROJECT_TYPES } from "../constants/projectTypes.js"

const linkSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  inSite: {
    type: Boolean,
    required: true,
    default: false,
  },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        if (this.inSite) return true // skip validation if inSite true
        return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid URL when inSite is false`,
    },
  },
})

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A project must have a name"],
    trim: true,
    unique: true,
    minlength: [3, "Name must have at least 3 characters"],
    maxlength: [100, "Name must have at most 100 characters"],
  },
  description: {
    type: String,
    required: [true, "A project must have a description"],
    trim: true,
    minlength: [3, "Description must have at least 3 characters"],
    maxlength: [200, "Description must have at most 200 characters"],
  },
  type: {
    type: String,
    enum: PROJECT_TYPES,
    required: [
      true,
      "A project must have a type (event, project, or experience)",
    ],
  },
  links: {
    type: [linkSchema],
    validate: {
      validator: function (v) {
        return v.length <= 3
      },
      message: "A project cannot have more than 3 links",
    },
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 15
      },
      message: "A project cannot have more than 15 tags",
    },
  },
})

const Project = mongoose.model("project", projectSchema)

export default Project
