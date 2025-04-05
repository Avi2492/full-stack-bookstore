import cloudinary from "../lib/cloudinary.js";
import Book from "../models/book.model.js";

export async function createBook(req, res) {
	try {
		const { title, caption, rating, image } = req.body;

		if (!image || !title || !caption || !rating) {
			return res.status(400).json({ message: "Please Provide all feilds!" });
		}

		// Upload Image
		const uploadResponse = await cloudinary.uploader.upload(image);
		const imageUrl = uploadResponse.secure_url;

		const newBook = new Book({
			title,
			caption,
			rating,
			image: imageUrl,
			user: req.user._id,
		});

		await newBook.save();
		res.status(201).json({ success: true, message: "Book Created!", newBook });
	} catch (error) {
		console.log(error);

		res
			.status(500)
			.json({ success: false, message: "Error in Creation" + error.message });
	}
}

export async function getAllBooks(req, res) {
	try {
		const page = req.query.page || 1;
		const limit = req.query.limit || 5;
		const skip = (page - 1) * limit;
		const books = await Book.find()
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("user", "username profileImage");

		const totalBooks = await Book.countDocuments();
		const totalPages = Math.ceil(totalBooks / limit);

		res.send({
			books,
			currentPage: page,
			totalBooks,
			totalPages,
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "Error in getting Books" + error.message,
		});
	}
}

export async function currentUserBooks(req, res) {
	try {
		const books = await Book.find({ user: req.user._id }).sort({
			createdAt: -1,
		});

		res.send({
			books,
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "Error in getting Books" + error.message,
		});
	}
}

export async function deleteBook(req, res) {
	try {
		const book = await Book.findById(req.params.id);

		if (!book) {
			res.status(404).json({
				success: false,
				message: "Book Not Found!",
			});
		}

		if (book.user.toString() !== req.user._id.toString()) {
			res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		if (book.image && book.image.includes("cloudinary")) {
			try {
				const publicId = book.image.split("/").pop().split(".")[0];

				await cloudinary.uploader.destroy(publicId);
			} catch (deleteError) {
				console.log(deleteError);
			}
		}

		await book.deleteOne();

		res.status(201).json({
			success: true,
			message: "Deleted Success",
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			success: false,
			message: "Error in deleting Books" + error.message,
		});
	}
}
