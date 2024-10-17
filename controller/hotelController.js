import fs from "fs";
import HotelModel from "../models/hotelModel.js";
import mongoose from "mongoose";

// add hotel
const addHotel = async (req, res) => {
  let image_filename = `${req?.file?.filename}`;

  const hotel = new HotelModel({
    userId: req.body.userId,
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    locationDescription: req.body.locationDescription,
    image: image_filename,
    country: req.body.country,
    province: req.body.province,
    city: req.body.city,
    gym: req.body.gym,
    spa: req.body.spa,
    bar: req.body.bar,
    laundry: req.body.laundry,
    restaurant: req.body.restaurant,
    shopping: req.body.shopping,
    freeParking: req.body.freeParking,
    bikeRental: req.body.bikeRental,
    freeWifi: req.body.freeWifi,
    movieNight: req.body.movieNight,
    swimmingPool: req.body.swimmingPool,
    coffeeShop: req.body.coffeeShop,
  });

  try {
    await hotel.save();
    res.status(201).json({ message: "Hotel added successfully", hotel: hotel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding hotel", error: error.message });
  }
};

// List all hotels based on the latest added
const listHotel = async (req, res) => {
  try {
    const hotels = await HotelModel.find({}).sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading hotels" });
  }
};

// Get hotel by ID
const getHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await HotelModel.findById(id).populate({
      path: "ratings.individualRatings.userId",
      select: "fullname",
    });

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const formattedRatings = hotel.ratings.individualRatings.map((rating) => ({
      userId: rating.userId._id,
      fullname: rating.userId.fullname,
      score: rating.score,
      comment: rating.comment,
      _id: rating._id,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...hotel.toObject(),
        ratings: {
          averageRating: hotel.ratings.averageRating,
          totalRating: hotel.ratings.totalRating,
          individualRatings: formattedRatings,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hotel",
      error: error.message,
    });
  }
};

// add review
const addReview = async (req, res) => {
  const { hotelId, userId, score, comment } = req.body;

  try {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found." });
    }
    const newRating = {
      userId,
      score,
      comment,
    };
    hotel.ratings.individualRatings.push(newRating);
    const totalRatings = hotel.ratings.totalRating + 1;
    const totalScore =
      hotel.ratings.averageRating * hotel.ratings.totalRating + score;

    hotel.ratings.totalRating = totalRatings;
    hotel.ratings.averageRating = totalScore / totalRatings;

    await hotel.save();

    res.status(201).json({ message: "Review added successfully.", hotel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding review", error: error.message });
  }
};

// Add room to hotel
const addRoomToHotel = async (req, res) => {
  const { hotelId } = req.params;
  let image_filename = `${req?.file?.filename}`;

  const {
    title,
    description,
    roomPrice,
    bedCount,
    guestCount,
    view,
    roomService,
    TV,
    balcony,
    freeWifi,
    airCondition,
    soundProof,
  } = req.body;

  try {
    const hotel = await HotelModel.findById(hotelId);

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    const newRoom = {
      title,
      description,
      image: image_filename,
      roomPrice,
      bedCount,
      guestCount,
      view,
      roomService: roomService || false,
      TV: TV || false,
      balcony: balcony || false,
      freeWifi: freeWifi || false,
      airCondition: airCondition || false,
      soundProof: soundProof || false,
    };

    hotel.rooms.push(newRoom);

    await hotel.save();

    res
      .status(201)
      .json({ success: true, message: "Room added successfully", data: hotel });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding room to hotel",
      error: error.message,
    });
  }
};

// Get hotels by userId
const getHotelByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const hotels = await HotelModel.find({ userId }).sort({ createdAt: -1 });

    if (!hotels || hotels.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No hotels found for this user" });
    }

    res.status(200).json({
      success: true,
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching hotels",
      error: error.message,
    });
  }
};

// book hotel
const bookHotel = async (req, res) => {
  const { roomId, userId, totalPrice, startDate, endDate } = req.body;

  try {
    const hotel = await HotelModel.findOne({ "rooms._id": roomId });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel room not found." });
    }

    const room = hotel.rooms.id(roomId);

    const isRoomAvailable = room.booking.every((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return startDate >= bookingEnd || endDate <= bookingStart; // Room is available if new booking does not overlap with existing bookings
    });

    if (!isRoomAvailable) {
      return res
        .status(400)
        .json({ message: "Room is not available for the selected dates." });
    }

    const newBooking = {
      userId,
      totalPrice,
      startDate,
      endDate,
      createdAt: Date.now(),
    };

    room.booking.push(newBooking);

    await hotel.save();

    return res
      .status(201)
      .json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error booking hotel", error: error.message });
  }
};

// get booking history
const getBookingListByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID format",
    });
  }

  try {
    const hotels = await HotelModel.find({ "rooms.booking.userId": userId })
      .populate({
        path: "rooms.booking",
        match: { userId: userId },
        select: "totalPrice startDate endDate createdAt",
      })
      .exec();

    const bookingList = hotels
      .map((hotel) => {
        const bookedRooms = hotel.rooms
          .filter((room) =>
            room.booking.some((booking) => booking.userId.toString() === userId)
          )
          .map((room) => {
            const bookingDetails = room.booking.find(
              (booking) => booking.userId.toString() === userId
            );
            return {
              id: room._id, // Room ID
              title: room.title, // Room title
              image: room.image, // Room image
              bedCount: room.bedCount, // Bed count
              guestCount: room.guestCount, // Guest count
              totalPrice: bookingDetails.totalPrice, // Booking price
              startDate: bookingDetails.startDate, // Start date of the booking
              endDate: bookingDetails.endDate, // End date of the booking
            };
          });

        return {
          id: hotel._id,
          title: hotel.title,
          image: hotel.image,
          city: hotel.city,
          country: hotel.country,
          bookedRooms: bookedRooms,
        };
      })
      .filter((hotel) => hotel.bookedRooms.length > 0);

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookingList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

export {
  addHotel,
  listHotel,
  getHotelById,
  addReview,
  addRoomToHotel,
  getHotelByUserId,
  bookHotel,
  getBookingListByUserId,
};
