import mongoose from "mongoose";

const geolocationSchema = new mongoose.Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, required: true },
  amenities: [String],
  bookings: [bookingSchema], // Bookings are now part of the room schema
});

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
    street: { type: String, required: true },
    geolocation: { type: geolocationSchema, required: true },
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
    rooms: [roomSchema],
  },
  { timestamps: true }
);

const HotelModel =
  mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);

export default HotelModel;
