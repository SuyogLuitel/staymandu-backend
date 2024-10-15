import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    locationDescription: { type: String },
    image: { type: String, required: true },
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    gym: { type: Boolean, default: false },
    spa: { type: Boolean, default: false },
    bar: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    restaurant: { type: Boolean, default: false },
    shopping: { type: Boolean, default: false },
    freeParking: { type: Boolean, default: false },
    bikeRental: { type: Boolean, default: false },
    freeWifi: { type: Boolean, default: false },
    movieNight: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    coffeeShop: { type: Boolean, default: false },
    ratings: {
      averageRating: { type: Number, default: 0 },
      totalRating: { type: Number, default: 0 },
      individualRatings: [ratingSchema],
    },
    rooms: [],
  },
  { timestamps: true }
);

const HotelModel =
  mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);

export default HotelModel;
