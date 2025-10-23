import { success } from "../helpers/response.js"
import Project from "../models/project.model.js"
import APIFeatures from "../utils/apiFeatures.js"
import AppError from "../utils/appError.js"
import { catchAsync } from "../utils/catchAsync.js"
import {
  validateLink,
  validateProject,
  validateProjectPatch,
} from "../validators/project.validator.js"

export const getAllProjects = catchAsync(async (req, res, next) => {
  // BUILD QUERY
  // 1A) Filtering

  // 2) Sorting

  // 3) Field Limiting

  // 4) Pagination

  // EXECUTE QUERY
  const features = new APIFeatures(
    Project.find(),
    req.query,
    req._aliasOptions,
    req.originalUrl
  ).implementFeatures()
  const projects = await features.query

  // SEND RESPONSE
  res.status(200).json({ ...success({ projects }), results: projects.length })
})

export const getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
  if (!project) return next(new AppError("Project not found", 404))
  res.status(200).json({ status: "success", data: { project } })
})

export const createProject = catchAsync(async (req, res, next) => {
  const { error: validationError, value } = validateProject(req.body)
  if (validationError)
    return next(new AppError(validationError.details[0].message, 400))
  const project = await Project.create(value)
  res.status(201).json({ status: "success", data: { project } })
})

export const updateProject = catchAsync(async (req, res, next) => {
  const { error: validationError, value } = validateProjectPatch(req.body)
  if (validationError)
    return next(new AppError(validationError.details[0].message, 400))
  const project = await Project.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true,
  })
  if (!project) {
    return next(new AppError("Project not found", 404))
  }
  res.status(200).json({ status: "success", data: { project } })
})

export const deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) return next(new AppError("Project not found", 404))
  res.status(204).json({ status: "success", data: null })
})

export const getProjectLink = catchAsync(async (req, res, next) => {
  const { projectId, linkId } = req.params
  const project = await Project.findById(projectId).select("links")
  if (!project) return next(new AppError("Project not found", 404))
  const link = project.links.id(linkId)
  if (!link) return next(new AppError("Link not found", 404))
  res.status(200).json({ status: "success", data: { link } })
})

export const updateProjectLink = catchAsync(async (req, res, next) => {
  const { projectId, linkId } = req.params
  const project = await Project.findById(projectId).select("links")
  if (!project) return next(new AppError("Project not found", 404))
  const link = project.links.id(linkId)
  if (!link) return next(new AppError("Link not found under this project", 404))

  const { error: validationError, value } = validateLink(req.body, link.inSite)
  if (validationError)
    return next(new AppError(validationError.details[0].message, 400))

  if (Object.prototype.hasOwnProperty.call(value, "type"))
    link.type = value.type
  if (Object.prototype.hasOwnProperty.call(value, "inSite"))
    link.inSite = value.inSite
  if (Object.prototype.hasOwnProperty.call(value, "url")) link.url = value.url

  await project.save()
  res.status(200).json({ status: "success", data: { link } })
})
