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

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: "Processing",
  },
  endDate: {
    type: Date,
    required: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  roomPrice: { type: Number, required: true },
  bedCount: { type: Number, required: true },
  guestCount: { type: Number, required: true },
  view: {
    type: String,
    enum: ["cityView", "oceanView", "forestView", "mountainView"],
    required: true,
  },
  roomService: { type: Boolean, default: false },
  TV: { type: Boolean, default: false },
  balcony: { type: Boolean, default: false },
  freeWifi: { type: Boolean, default: false },
  airCondition: { type: Boolean, default: false },
  soundProof: { type: Boolean, default: false },
  booking: [bookingSchema],
});

const hotelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Hotel", "Apartment", "Villa", "Resort"],
      required: true,
    },
    description: { type: String, required: true },
    locationDescription: { type: String },
    image: { type: String, required: true },
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    streetname: { type: String, required: true },
    url: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
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
    rooms: [roomSchema],
  },
  { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });

const HotelModel =
  mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);

export default HotelModel;
