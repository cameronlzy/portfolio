import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
      trim: true,
      minlength: [3, "Name must have at least 3 characters"],
      maxlength: [100, "Name must have at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "A project must have a description"],
      trim: true,
      minlength: [3, "Description must have at least 3 characters"],
      maxlength: [500, "Description must have at most 500 characters"],
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never return password in queries
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // Only works on CREATE & SAVE
        validator: function (el) {
          return el === this.password
        },
        message: "Passwords do not match",
      },
    },
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid URL when inSite is false`,
      },
    },
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(v)
        },
        message: (props) =>
          `${props.value} is not a valid URL when inSite is false`,
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    console.log(JWTTimestamp, changedTimeStamp)
    return JWTTimestamp < changedTimeStamp
  }

  return false
}

const User = mongoose.model("user", userSchema)

export default User
