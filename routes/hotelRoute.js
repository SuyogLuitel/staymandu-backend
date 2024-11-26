import express from "express";
import {
  addHotel,
  addReview,
  addRoomToHotel,
  bookHotel,
  deleteHotel,
  getBookingListByUserId,
  getHotelById,
  getHotelByUserId,
  incrementCount,
  listHotel,
  listHotelsByDistance,
  verifyOrder,
} from "../controller/hotelController.js";
import multer from "multer";

const hotelRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
});

// Route to add a new hotel
hotelRouter.post("/add", upload.single("image"), addHotel);

// Route to add a new hotel
hotelRouter.post("/add-room/:hotelId", upload.single("image"), addRoomToHotel);

// Route to list all hotel
hotelRouter.get("/list", listHotel);

// Route to delete hotel
hotelRouter.delete("/:hotelId", deleteHotel);

// Route to increment count
hotelRouter.patch("/increment/:id", incrementCount);

// Route to list hotels by distance
hotelRouter.get("/nearest", listHotelsByDistance);

// Route to list hotel based on user id
hotelRouter.get("/list/:userId", getHotelByUserId);

// Route to list specific hotel
hotelRouter.get("/:id", getHotelById);

// Route to add review
hotelRouter.post("/add-review", addReview);

// Route to book hotel
hotelRouter.post("/book-hotel", bookHotel);
hotelRouter.post("/verify", verifyOrder);

// Route to list booked hotel by user id
hotelRouter.get("/booking/:userId", getBookingListByUserId);

export default hotelRouter;
