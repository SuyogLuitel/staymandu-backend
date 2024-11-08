import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import hotelRouter from "./routes/hotelRoute.js";
import "dotenv/config";
import adminRouter from "./routes/adminRoute.js";

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/hotel", hotelRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Working");
});

// app.listen(port, () => {
//   console.log(`Server started on http://localhost:${port}`);
// });

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.10.71:${port}`);
});
