import express from "express"
import morgan from "morgan"
import projectRouter from "./routes/project.route.js"
import userRouter from "./routes/user.route.js"
import AppError from "./utils/appError.js"
import globalErrorHandler from "./controllers/error.controller.js"
import { dirname } from "path"
import { fileURLToPath } from "url"
import cookieParser from "cookie-parser"
import cors from "cors"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const app = express()

// 1) Middleware
const corsConfig = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}
// if you need cookies (axios.withCredentials = true), you must use a specific origin and allow credentials
app.use(cors(corsConfig))
// handle preflight explicitly (optional but safe)
app.options(/.*/, cors(corsConfig))

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")) // Logger
}

app.use(cookieParser())
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "HELLO FROM SERVER",
//     app: "Natours",
//   });
// });

//2) Route Handlers

// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour); // btr than put as more lightweight
// app.delete("/api/v1/tours/:id", deleteTour);

// 3) Routes

app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/users", userRouter)
app.use(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

export default app
