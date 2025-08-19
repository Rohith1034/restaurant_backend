const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  cuisineType: { type: String, required: true },
  deliveryTime: { type: String, required: true }, // e.g., "25-30 min"
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  image: { type: String, required: true },
  bannerImage: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  openingHours: {
    Monday: String,
    Tuesday: String,
    Wednesday: String,
    Thursday: String,
    Friday: String,
    Saturday: String,
    Sunday: String,
  },
  featured: { type: Boolean, default: false },
});

const Restaurants = mongoose.model("Restaurants",restaurantSchema);

module.exports = Restaurants;

