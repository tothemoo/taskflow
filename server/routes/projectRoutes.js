const express = require("express")
const protect = require("../middleware/authMiddleware")

const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject
}= require("../controllers/projectController")

const router = express.Router();

router.use(protect)

router.post("/", createProject)

router.get("/",getProjects);

router.get("/:id",getProjectById);

router.put("/:id", updateProject);
console.log({
    createProject: typeof createProject,
    getProjects: typeof getProjects,
    getProjectById: typeof getProjectById,
    updateProject: typeof updateProject,
    deleteProject: typeof deleteProject
});
router.delete("/:id", deleteProject)

module.exports = router