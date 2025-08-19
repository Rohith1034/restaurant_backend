const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Schemas/User");
const bcrypt = require("bcrypt");
const Restaurants = require("./Schemas/Restaurant");
const Products = require("./Schemas/Product");
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client("937229950296-bhjeopfcgnjs508cj7jhhitcmhd41222.apps.googleusercontent.com");

const app = express();

app.use(express.json({ limit: "40mb" })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: "40mb" }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://rohithchanda7:Cr7%401034@cluster0.gn5lvfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(5000, () => {
  console.log("server started at port 5000");
});

// SignUp Route

app.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(409).json({ msg: "User already exits" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = User({
      name: fullName,
      email: email,
      password: hashedPassword,
      phone: phone,
      addresses: [],
      favorites: [],
      orders: [],
    });
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({ msg: "User Created Successfully", userId: savedUser._id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error while creating user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (isMatch) {
      res.status(200).json({ msg: "Login successful", userId: foundUser._id });
    } else {
      res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error during login" });
  }
});

app.post("/auth/google", async (req, res) => {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: req.body.token,
      audience: "937229950296-bhjeopfcgnjs508cj7jhhitcmhd41222.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({ name: payload.name, email: payload.email, password: null });
    }
    res.json({ msg: "Google login successful", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Google auth failed" });
  }
});

// Middle wares

app.use((req, res, next) => {
  if (!req.headers.userid) {
    return res.status(401).json({ msg: "User is unauthorized" });
  }
  next();
});

// User data

app.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: "Invalid user ID format" }); // ✅ Better feedback
  }

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    res.status(500).json({ msg: "Server error please try again" });
  }
});

// Edit User

app.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, profileImg } = req.body;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "User is unauthorized" });
    }
    foundUser.name = name;
    foundUser.email = email;
    foundUser.phone = phone;
    foundUser.profileImage = profileImg;
    const savedUser = await foundUser.save();
    res.status(200).json({ msg: "Changes saved" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Add address
app.post("/:userId/addNewAddress", async (req, res) => {
  const { userId } = req.params;
  const newAddress = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "No user found" });
    }

    if (!Array.isArray(foundUser.addresses)) {
      foundUser.addresses = [];
    }

    // If new isDefault=true, clear existing defaults
    if (newAddress.isDefault) {
      foundUser.addresses.forEach((addr) => (addr.isDefault = false));
    }

    foundUser.addresses.push(newAddress);
    await foundUser.save();

    res.status(200).json({
      msg: "Address added successfully",
      addresses: foundUser.addresses,
    });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ msg: "Server error. Try again!" });
  }
});

// Update address
app.put("/:userId/updateAddress/:addressId", async (req, res) => {
  const { userId, addressId } = req.params;
  const editedAddress = req.body;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "No user found" });
    }

    const address = foundUser.addresses.id(addressId);
    if (!address) return res.status(404).json({ msg: "Address not found" });

    if (editedAddress.isDefault) {
      foundUser.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, editedAddress);
    await foundUser.save();

    res.status(200).json({
      msg: "Address updated successfully",
      addresses: foundUser.addresses,
    });
  } catch (err) {
    console.error("Edit address error:", err);
    res.status(500).json({ msg: "Server error. Try again!" });
  }
});

// Delete address
app.delete("/:userId/deleteAddress/:addressId", async (req, res) => {
  const { userId, addressId } = req.params;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "No user found" });
    }

    foundUser.addresses.pull(addressId);
    await foundUser.save();

    res.status(200).json({
      msg: "Address deleted successfully",
      addresses: foundUser.addresses,
    });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ msg: "Server error. Try again!" });
  }
});

// Add to cart
app.post("/:userid/addTocart", async (req, res) => {
  const userId = req.params.userid;
  const productData = req.body.productData;
  try{
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      res.status(401).json({msg:"User not found"});
    }
    console.log(foundUser);
    foundUser.cart.push(productData);
    await foundUser.save();
    res.status(200).json({msg:"Product added to cart successfull"});
  }catch (err) {
    console.log("Add to cart",err);
    res.status(500).json({msg:"Server error please try again"});
  }
});

// Delete in cart
app.delete("/cart/:productId", async (req, res) => {
  const userId = req.headers.userid;
  const productId = req.params.productId;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove item from cart
    foundUser.cart = foundUser.cart.filter(
      (item) => item._id.toString() !== productId
    );

    await foundUser.save();
    return res.status(200).json({ msg: "Item removed from cart" });
  } catch (err) {
    console.log("Remove from cart:", err);
    return res.status(500).json({ msg: "Server error, please try again" });
  }
});


// All Restaurants
app.get("/getAllRestaurants", async (req, res) => {
  try {
    const foundRestaurants = await Restaurants.find();
    return res.status(200).json({ msg: foundRestaurants });
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Server error please try again!" });
  }
});

// Single Restaurant

app.get("/restaurant/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foundRestaurant = await Restaurants.findById(id);
    if (!foundRestaurant) {
      res.status(404).json({ msg: "Retry again" });
    }
    res.status(200).json({ msg: foundRestaurant });
  } catch (err) {
    console.log("Single restaurant: ", err);
    res.status(500).json({ msg: "Server error retry again" });
  }
});

// Random 4 restaurants
app.get("/restaurants/random", async (req, res) => {
  try {
    const randomRestaurants = await Restaurants.aggregate([
      { $sample: { size: 4 } },
    ]);

    for (let i = 0; i < 4; i++) {
      randomRestaurants[i].featured = false;
    }

    return res.status(200).json({ msg: randomRestaurants });
  } catch (err) {
    console.log("Random Restaurants:", err);
    res.status(500).json({ msg: "Server error, please try again!" });
  }
});

// All products

app.get("/allProducts", async (req, res) => {
  try {
    const foundProducts = await Products.find();
    return res.status(200).json({ msg: foundProducts });
  } catch (err) {
    console.log("All Products", err);
    res.status(500).send({ msg: "Server error please try again!" });
  }
});

// One Product

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foundProduct = await Products.findById(id);
    if (!foundProduct) {
      res.status(404).json({ msg: "Retry again" });
    }
    res.status(200).json({ msg: foundProduct });
  } catch (err) {
    console.log("Single Product: ", err);
    res.status(500).json({ msg: "Server error retry again" });
  }
});

// GET /products/random

app.post("/products/random", async (req, res) => {
  const count = parseInt(req.body.count) || 4;
  try {
    const randomProducts = await Products.aggregate([
      { $sample: { size: count } },
    ]);
    return res.status(200).json({ msg: randomProducts });
  } catch (err) {
    console.log("Random Products:", err);
    res.status(500).json({ msg: "Server error, please try again!" });
  }
});

// Fuzzy Search
app.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ msg: "Query is required" });

  try {
    // Search restaurants by name
    const restaurantResults = await Restaurants.find({
      name: { $regex: query, $options: "i" },
    }).limit(5);

    // Search products/dishes by name
    const productResults = await Products.find({
      name: { $regex: query, $options: "i" },
    }).limit(5);

    // Combine results
    const results = [
      ...restaurantResults.map((r) => ({ type: "restaurant", ...r.toObject() })),
      ...productResults.map((p) => ({ type: "product", ...p.toObject() })),
    ];

    res.status(200).json({ results });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});
