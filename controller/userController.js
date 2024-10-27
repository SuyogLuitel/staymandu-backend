import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesnot exists" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credendials" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successfully",
      access: token,
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // checking if user already exists
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // validating existing format & strong password
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // hashing user password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const newUser = new userModel({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res
      .status(201)
      .json({ success: true, message: "User created successfully!" });
  } catch (error) {
    console.log(error);
  }
};

// Add a favorite hotel to user's favorites
const addFavoriteHotel = async (req, res) => {
  const { userId, hotelId } = req.body;

  try {
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Determine if the hotel is already a favorite
    const isFavorite = user.favorites.includes(hotelId);

    // Update the user's favorites based on current status
    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        isFavorite
          ? { $pull: { favorites: hotelId } }
          : { $addToSet: { favorites: hotelId } },
        { new: true }
      )
      .populate("favorites");

    // Respond with appropriate success message
    res.status(200).json({
      success: true,
      message: isFavorite
        ? "Hotel removed from favorites successfully"
        : "Hotel added to favorites successfully",
      data: updatedUser.favorites,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all favorite hotels for a specific user
const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await userModel.findById(userId).populate("favorites");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Favorite hotels fetched successfully",
      data: user.favorites,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export { loginUser, registerUser, addFavoriteHotel, getFavorites };
