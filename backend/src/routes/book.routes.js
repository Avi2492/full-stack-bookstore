import express from "express";
import {
	createBook,
	currentUserBooks,
	deleteBook,
	getAllBooks,
} from "../controllers/book.controller.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, createBook);
router.get("/", protectRoute, getAllBooks);
router.get("/user", protectRoute, currentUserBooks);
router.delete("/:id", protectRoute, deleteBook);

export default router;
