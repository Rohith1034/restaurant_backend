const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true 
  },
  items: [{
    product: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' 
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['Credit Card', 'Cash on Delivery', 'PayPal'], 
    required: true 
  },
  orderDate: { type: Date, default: Date.now },
  deliveryInstructions: { type: String }
});

const Orders = mongoose.model("Orders",orderSchema);

module.exports = Orders;