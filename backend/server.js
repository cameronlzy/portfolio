import mongoose from "mongoose"
import dotenv from "dotenv"
import { unhandledError } from "./utils/unhandledError.js"

process.on("uncaughtException", (err) => {
  unhandledError(err, "UNCAUGHT EXCEPTION!")
})

dotenv.config({ path: "./config.env" })

const { default: app } = await import("./app.js")

const DB = process.env.DATABASE
mongoose.connect(DB).then(() => console.log("DB Connection Successful"))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`App running on Port ${port}...`)
})

process.on("unhandledRejection", (err) => {
  unhandledError(err, "UNHANDLED REJECTION!", server)
})
