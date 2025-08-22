// routes/restaurant.js
const express = require('express');
const Restaurant = require('../Schemas/Restaurant');
const Product = require('../Schemas/Product');

const router = express.Router();

// POST /api/restaurant/signup - Register a new restaurant
router.post('/signup', async (req, res) => {
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
    const existingRestaurant = await Restaurant.findOne({ email });
    if (existingRestaurant) {
      return res.status(400).json({ message: 'Restaurant already exists with this email' });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
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

// POST /api/restaurant/login - Login restaurant
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find restaurant by email
    const restaurant = await Restaurant.findOne({ email });
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
router.post('/logout', (req, res) => {
  res.clearCookie('restaurantId');
  res.json({ message: 'Logout successful' });
});

// GET /api/restaurant/verify/:id - Verify restaurant session
router.get('/verify/:id', async (req, res) => {
  try {
    const restaurantId = req.params.id;
    
    if (!restaurantId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    
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
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
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
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Don't allow updating email or password through this endpoint
    delete updates.email;
    delete updates.password;
    
    const restaurant = await Restaurant.findByIdAndUpdate(
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
router.get('/:restaurantId/products', async (req, res) => {
  try {
    const products = await Product.find({ restaurant: req.params.restaurantId })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/restaurant/:restaurantId/products - Create a new product
router.post('/:restaurantId/products', async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      available: available !== undefined ? available : true,
      restaurant: req.params.restaurantId
    });
    
    await product.save();
    
    // Populate restaurant details if needed
    await product.populate('restaurant', 'name');
    
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
router.get('/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({
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
router.put('/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
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
router.delete('/:restaurantId/products/:productId', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
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

module.exports = router;