import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import validator from "validator";
import adminModel from "../models/adminModel.js";

// login user
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await adminModel.findOne({ email });

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
const registerAdmin = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // checking if user already exists
    const exists = await adminModel.findOne({ email });

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

    const newUser = new adminModel({
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

export { loginAdmin, registerAdmin };
