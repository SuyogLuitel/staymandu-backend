import express from "express";
import {
  addFavoriteHotel,
  getAllUser,
  getFavorites,
  loginUser,
  registerUser,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.get("/list", getAllUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/favorite", addFavoriteHotel);
userRouter.get("/favorite/:userId", getFavorites);

export default userRouter;
