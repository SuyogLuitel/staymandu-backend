import express from "express";
import { addHotel, addRoom } from "../controller/hotelController";

const hotelRouter = express.Router();

// Route to add a new hotel
hotelRouter.post("/add", addHotel);

// Route to add a new room to an existing hotel
hotelRouter.post("/add/room/:hotelId", addRoom);

export default hotelRouter;
