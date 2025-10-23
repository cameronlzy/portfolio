import express from "express"
import {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
  getProjectLink,
  updateProjectLink,
} from "../controllers/project.controller.js"
import { authoriseObjectId } from "../middleware/authoriseObjectId.js"

const router = express.Router()

router.param("id", authoriseObjectId)
router.param("projectId", authoriseObjectId)
router.param("linkId", authoriseObjectId)

router.route("/").get(getAllProjects).post(createProject)
router.route("/:id").get(getProject).patch(updateProject).delete(deleteProject)
router
  .route("/:projectId/links/:linkId")
  .get(getProjectLink)
  .patch(updateProjectLink)

export default router
