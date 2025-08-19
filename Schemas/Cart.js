const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    specialInstructions: { type: String }
  }],
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant' 
  },
  createdAt: { type: Date, default: Date.now, expires: 172800 } // Auto-delete after 48 hours
});

const Cart = mongoose.model("Cart",cartSchema);

module.exports = Cart;