import { Router } from "express";
import { checkAuth, loginUser, logoutUser, registerUser } from "../controllers/admin.controller.js"
import { getTickets, sendFeedback } from "../controllers/user.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js"
const router = Router();

// for admin
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/check-auth").get(verifyJWT,checkAuth)
router.route("/logout").post(logoutUser)
router.route("/feedback").get(verifyJWT,getTickets)
// for user
router.route("/feedback").post(sendFeedback)

export default router