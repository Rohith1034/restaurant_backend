const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./Schemas/User");
const bcrypt = require("bcrypt");
const Restaurants = require("./Schemas/Restaurant");
const Products = require("./Schemas/Product");
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const restaurantRoutes = require("./routes/restaurant")
const googleClient = new OAuth2Client(process.env.GOOGLEURL);
const Orders = require("./Schemas/Order");

const app = express();

app.use(express.json({ limit: "40mb" })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: "40mb" }));
app.use(cors({
  origin: 'https://restaurant-frontend-wgp4.vercel.app', // Your frontend URL
  credentials: true
}));


mongoose
  .connect(
    process.env.MONGOURL
  )
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log("server started at port ",process.env.PORT);
});


app.post('/api/restaurant/signup', async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      description,
      cuisineType,
      deliveryTime,
      image,
      bannerImage,
      address,
      openingHours
    } = req.body;

    // Check if restaurant already exists
    const existingRestaurant = await Restaurants.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant already exists with this email' });
    }

    // Create new restaurant
    const restaurant = new Restaurants({
      email,
      password,
      name,
      description,
      cuisineType,
      deliveryTime,
      image,
      bannerImage,
      address,
      openingHours
    });

    await restaurant.save();

    // Set restaurant ID in cookie
    res.cookie('restaurantId', restaurant._id.toString(), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurantId: restaurant._id
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/restaurant/login - Login restaurant`
app.post('/api/restaurant/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find restaurant by email
    const restaurant = await Restaurants.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await restaurant.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set restaurant ID in cookie
    res.cookie('restaurantId', restaurant._id.toString(), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.json({
      message: 'Login successful',
      restaurantId: restaurant._id
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/restaurant/logout - Logout restaurant
app.post('/api/restaurant/logout', (req, res) => {
  res.clearCookie('restaurantId');
  res.json({ message: 'Logout successful' });
});

// GET /api/restaurant/verify/:id - Verify restaurant session
app.get('/api/restaurant/verify/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    if (!restaurantId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const restaurant = await Restaurants.findById(restaurantId);
    
    if (!restaurant) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    
    res.json({ verified: true });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/restaurant/:id - Get restaurant details
app.get('/api/restaurant/:id', async (req, res) => {
  try {
    const restaurant = await Restaurants.findById(req.params.id)
      .select('-password'); // Exclude password field
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/restaurant/:id - Update restaurant details
app.put('/api/restaurant/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Don't allow updating email or password through this endpoint
    delete updates.email;
    delete updates.password;
    
    const restaurant = await Restaurants.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(restaurant);
  } catch (error) {
    console.error('Update restaurant error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// Product CRUD routes

// GET /api/restaurant/:restaurantId/products - Get all products for a restaurant
app.get('/api/restaurant/:restaurantId/products', async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurantName = await Restaurants.find(restaurantId);
    const products = await Products.find({ restaurant:restaurantName.name})
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/restaurant/:restaurantId/products - Create a new product
app.post('/api/restaurant/:restaurantId/products', async (req, res) => {
  try {
    const { 
      restaurant,   // restaurant name (string)
      name, 
      description, 
      price, 
      category, 
      image, 
      available, 
      ingredients, 
      dietaryInfo, 
      preparationTime 
    } = req.body;
    
    const product = new Products({
      restaurant,  // store restaurant name instead of ID
      name,
      description,
      price,
      category,
      image,
      available: available !== undefined ? available : true,
      ingredients: ingredients || [],
      dietaryInfo: {
        vegetarian: dietaryInfo?.vegetarian || false,
        vegan: dietaryInfo?.vegan || false,
        glutenFree: dietaryInfo?.glutenFree || false,
      },
      preparationTime: preparationTime || null
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/restaurant/:restaurantId/products/:productId - Get a specific product
app.get('/api/restaurant/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Products.findOne({
      _id: req.params.productId,
      restaurant: req.params.restaurantId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/restaurant/:restaurantId/products/:productId - Update a product
app.put('/api/restaurant/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Products.findOneAndUpdate(
      {
        _id: req.params.productId,
        restaurant: req.params.restaurantId
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/restaurant/:restaurantId/products/:productId - Delete a product
app.delete('/api/restaurant/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Products.findOneAndDelete({
      _id: req.params.productId,
      restaurant: req.params.restaurantId
    });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
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

// GET /orders - Get all orders for a user
app.get("/orders", async (req, res) => {
  try {
    const userId = req.headers.userid; // client must send userId in headers

    const orders = await Orders.find({ user: userId })
      .populate('restaurant', 'name image address')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ msg: "Server error, please try again" });
  }
});


// POST /orders - Create a new order
app.post("/orders", async (req, res) => {
  try {
    const userId = req.headers.userid;
    const { restaurant, items, totalAmount, deliveryAddress, status } = req.body;

    const newOrder = new Orders({
      user: userId,
      restaurant,        // should be restaurant _id
      items,             // array: [{ product, quantity }]
      totalAmount,
      deliveryAddress,
      status: status || "Pending"
    });

    await newOrder.save();

    res.status(201).json({ msg: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ msg: "Server error, please try again" });
  }
});

// GET /orders/:orderId - Get a specific order
app.get("/orders/:orderId", async (req, res) => {
  try {
    const userId = req.headers.userid;
    const orderId = req.params.orderId;

    const order = await Orders.findOne({ _id: orderId, user: userId })
      .populate('restaurant', 'name image address')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ msg: "Server error, please try again" });
  }
});

