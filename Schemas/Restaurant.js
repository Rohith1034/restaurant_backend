const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
   email: { 
    type: String, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    minlength: 6
  },
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

restaurantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
restaurantSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update the updatedAt field before saving
restaurantSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Restaurants = mongoose.model("Restaurants",restaurantSchema);

module.exports = Restaurants;

