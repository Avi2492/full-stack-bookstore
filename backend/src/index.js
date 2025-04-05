import express from "express";
import "dotenv/config";
import { connectDB } from "./db/connectDatabase.js";
import authRoutes from "./routes/auth.routes.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
	res.status(200).json({ message: "API is running", success: true });
});

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
	connectDB();
});
