import { promisify } from "util";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";
import User from "../models/user.model.js";

export const authoriseRouteAccess = catchAsync(async (req, res, next) => {
  let token;
  // 1) Get Token and check if its there
  if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401),
    );
  }
  // 2) Validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //   if (!tokenValidity) {
  //     return next(
  //       new AppError("Token is invalid! Please re-login to get access", 401),
  //     );
  //   }
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  // 4) Check if user changed password after token issued
  const changedPassword = currentUser.changedPasswordAfter(decoded.iat);
  if (changedPassword) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401),
    );
  }
  req.user = currentUser;
  next();
});
