import express from "express"
import { authoriseObjectId } from "../middleware/authoriseObjectId.js"
import { login, signup } from "../controllers/auth.controller.js"
import {
  getUser,
  updateUser,
  getOwner,
} from "../controllers/user.controller.js"
import { authoriseRouteAccess } from "../middleware/authoriseRouteAccess.js"

const router = express.Router()

router.param("id", authoriseObjectId)

router.post("/signup", signup)
router.post("/login", login)
router.route("/owner").get(getOwner)
router.route("/:id").get(getUser).patch(authoriseRouteAccess, updateUser)

export default router
