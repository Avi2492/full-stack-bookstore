import express from "express";
import "dotenv/config";
import { connectDB } from "./db/connectDatabase.js";

const app = express();
const PORT = process.env.PORT || 5000;

// app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
	console.log(`Server is running at ${PORT}`);
	connectDB();
});
