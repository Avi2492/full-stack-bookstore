import express from "express";
import {
	signup,
	login,
	logout,
	getAuth,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.get("/get-me", getAuth);

export default router;
