import HotelModel from "../models/hotelModel";

export const addHotel = async (req, res) => {
  try {
    const {
      userId,
      title,
      type,
      description,
      locationDescription,
      image,
      country,
      province,
      city,
      street,
      geolocation,
      gym,
      spa,
      bar,
      laundry,
      restaurant,
      shopping,
      freeParking,
      bikeRental,
      freeWifi,
      movieNight,
      swimmingPool,
      coffeeShop,
    } = req.body;

    const newHotel = new HotelModel({
      userId,
      title,
      type,
      description,
      locationDescription,
      image,
      country,
      province,
      city,
      street,
      geolocation,
      gym,
      spa,
      bar,
      laundry,
      restaurant,
      shopping,
      freeParking,
      bikeRental,
      freeWifi,
      movieNight,
      swimmingPool,
      coffeeShop,
    });

    await newHotel.save();
    res
      .status(201)
      .json({ message: "Hotel added successfully", hotel: newHotel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding hotel", error: error.message });
  }
};

export const addRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { roomNumber, type, price, capacity, amenities } = req.body;

    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const newRoom = {
      roomNumber,
      type,
      price,
      capacity,
      amenities,
      bookings: [],
    };

    hotel.rooms.push(newRoom);
    await hotel.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding room", error: error.message });
  }
};
