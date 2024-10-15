import fs from "fs";
import HotelModel from "../models/hotelModel.js";

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

// list all hotel
const listHotel = async (req, res) => {
  try {
    const hotels = await HotelModel.find({});
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading hotel" });
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

export { addHotel, listHotel, getHotelById, addReview };
