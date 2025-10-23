import User from "../models/user.model.js"
import AppError from "../utils/appError.js"
import { catchAsync } from "../utils/catchAsync.js"
import { validateUserPatch } from "../validators/user.validator.js"

const ownerId = process.env.OWNER_ID

// GET /api/v1/users/:id
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) return next(new AppError("User not found", 404))

  res.status(200).json({
    status: "success",
    data: { user },
  })
})

// PATCH /api/v1/users/:id
export const updateUser = catchAsync(async (req, res, next) => {
  const { error, value } = validateUserPatch(req.body)
  if (error) return next(new AppError(error.details[0].message, 400))

  // never allow password update here, force dedicated route for that
  if (value.password || value.passwordConfirm) {
    return next(new AppError("This route is not for password updates", 400))
  }

  const user = await User.findByIdAndUpdate(req.params.id, value, {
    new: true,
    runValidators: true,
  })

  if (!user) return next(new AppError("User not found", 404))

  res.status(200).json({
    status: "success",
    data: { user },
  })
})

// GET /api/v1/users/owner
export const getOwner = catchAsync(async (req, res, next) => {
  const user = await User.findById(ownerId)
  if (!user) return next(new AppError("User not found", 404))

  res.status(200).json({
    status: "success",
    data: { user },
  })
})
