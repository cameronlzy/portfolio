import { success } from "../helpers/response.js"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import AppError from "../utils/appError.js"
import { catchAsync } from "../utils/catchAsync.js"
import { validateLogin, validateUser } from "../validators/user.validator.js"
import { COOKIESETTING } from "../constants/cookieSetting.js"

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN),
  })
}

export const signup = catchAsync(async (req, res, next) => {
  const { error: validationError, value } = validateUser(req.body)
  if (validationError) {
    return next(new AppError(validationError.details[0].message, 400))
  }
  const newUser = await User.create(value)
  const userSafe = newUser.toObject()
  delete userSafe.password

  const token = signToken(userSafe._id)

  res.cookie("jwt", token, COOKIESETTING)
  res.status(201).json(success({ user: userSafe }, 201))
})

export const login = catchAsync(async (req, res, next) => {
  // Check if email and password exist
  const { error: validationError, value } = validateLogin(req.body)
  if (validationError) {
    return next(new AppError(validationError.details[0].message, 400))
  }

  // Check if user and password is correct
  const user = await User.findOne({ email: value.email }).select("+password")
  const correct =
    user && (await user.correctPassword(req.body.password, user.password))

  if (!correct) {
    return next(new AppError("Incorrect email or password", 401))
  }
  // If everything ok, can send token to client
  const userSafe = user.toObject()
  delete userSafe.password
  const token = signToken(userSafe._id)
  res.cookie("jwt", token, COOKIESETTING)
  res.status(201).json(success({ user: userSafe }, 201))
})
