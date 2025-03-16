import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
	return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

export async function signup(req, res) {
	try {
		const { email, username, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).json({
				message: "All feilds Required",
				success: false,
			});
		}

		if (password.length < 6) {
			return res.status(400).json({
				message: "Password should be atleast 6 characters long",
				success: false,
			});
		}

		if (username.length < 3) {
			return res.status(400).json({
				message: "Username should be atleast 3 characters long",
				success: false,
			});
		}

		const existingUser = await User.findOne({ $or: [{ email }, { username }] });

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User Already Existed in DB", success: false });
		}

		const profilePic = `https://avatar.iran.liara.run/public?username=${username}`;

		const user = new User({
			email,
			username,
			password,
			profileImage: profilePic,
		});

		await user.save();

		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: "Account Created!",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		console.log("Error in Signup", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function login(req, res) {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({
				message: "All feilds Required",
				success: false,
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res
				.status(400)
				.json({ message: "User doesn't exist", success: false });
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = generateToken(user._id);

		res.status(200).json({
			success: true,
			message: "Logged In",
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		console.log("Error in Login", error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function logout(req, res) {
	try {
		res.clearCookie("token");
		res.status(200).json({ success: true, message: "Logout Success" });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
}

export async function getAuth(req, res) {
	try {
		const user = await User.findOne(req.email).select("-password");
		res.clearCookie("token");

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found!" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
}
