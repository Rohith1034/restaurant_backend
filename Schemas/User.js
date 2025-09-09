const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  phone: { type: String, required: false },
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      isDefault: Boolean,
    },
  ],
  profileImage: { type: String, default: "" },
  cart: [],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  createdAt: { type: Date, default: Date.now },
  paymentMethods: []
});

const User = mongoose.model("Users",UserSchema);

module.exports = User;
