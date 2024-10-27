import express from "express";
import {
  addFavoriteHotel,
  getFavorites,
  loginUser,
  registerUser,
} from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/favorite", addFavoriteHotel);
userRouter.get("/favorite/:userId", getFavorites);

export default userRouter;
