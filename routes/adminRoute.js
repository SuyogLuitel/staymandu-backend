import express from "express";
import { loginAdmin, registerAdmin } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/signup", registerAdmin);

export default adminRouter;
