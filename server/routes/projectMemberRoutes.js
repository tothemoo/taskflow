const express = require("express")
const protect = require("../middleware/authMiddleware")

const {
    addProjectMember,
    getProjectMembers,
    removeProjectMember
} = require("../controllers/projectMemberController");

const router=express.Router();

router.use(protect);

router.post("/:id/members", addProjectMember);
router.get("/:id/members", getProjectMembers);
router.delete("/:id/members/:userId", removeProjectMember);

module.exports=router