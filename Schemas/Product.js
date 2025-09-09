const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Burgers", "Pizza"
  image: { type: String, required: true },
  restaurant: { 
    type: String, 
    ref: 'Restaurant', 
    required: true 
  },
  popular: { type: Boolean, default: false },
  ingredients: [String],
  dietaryInfo: {
    vegetarian: Boolean,
    vegan: Boolean,
    glutenFree: Boolean
  },
  preparationTime: { type: Number } // in minutes
});

const Products = mongoose.model("Products",productSchema);

module.exports = Products;