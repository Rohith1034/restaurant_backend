import fs from "fs";

const data = [
  {
    name: "Bella Italia",
    description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas",
    cuisineType: "Italian",
    deliveryTime: "25-30 min",
    rating: 4.7,
    reviewCount: 124,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    openingHours: {
      Monday: "11:00 AM - 10:00 PM",
      Tuesday: "11:00 AM - 10:00 PM",
      Wednesday: "11:00 AM - 10:00 PM",
      Thursday: "11:00 AM - 11:00 PM",
      Friday: "11:00 AM - 12:00 AM",
      Saturday: "10:00 AM - 12:00 AM",
      Sunday: "10:00 AM - 10:00 PM"
    },
    featured: true
  },
  {
    name: "Sushi Masters",
    description: "Fresh Japanese sushi and sashimi prepared by master chefs",
    cuisineType: "Japanese",
    deliveryTime: "30-40 min",
    rating: 4.8,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Park Avenue",
      city: "New York",
      state: "NY",
      zipCode: "10022"
    },
    openingHours: {
      Monday: "12:00 PM - 10:00 PM",
      Tuesday: "12:00 PM - 10:00 PM",
      Wednesday: "12:00 PM - 10:00 PM",
      Thursday: "12:00 PM - 11:00 PM",
      Friday: "12:00 PM - 11:00 PM",
      Saturday: "11:30 AM - 11:00 PM",
      Sunday: "11:30 AM - 10:00 PM"
    },
    featured: true
  },
  {
    name: "Burger Palace",
    description: "Gourmet burgers and hand-cut fries made with premium ingredients",
    cuisineType: "American",
    deliveryTime: "20-25 min",
    rating: 4.5,
    reviewCount: 87,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Broadway",
      city: "New York",
      state: "NY",
      zipCode: "10003"
    },
    openingHours: {
      Monday: "11:00 AM - 10:00 PM",
      Tuesday: "11:00 AM - 10:00 PM",
      Wednesday: "11:00 AM - 10:00 PM",
      Thursday: "11:00 AM - 11:00 PM",
      Friday: "11:00 AM - 12:00 AM",
      Saturday: "10:00 AM - 12:00 AM",
      Sunday: "10:00 AM - 10:00 PM"
    },
    featured: false
  },
  {
    name: "Thai Delight",
    description: "Authentic Thai flavors with a modern twist",
    cuisineType: "Thai",
    deliveryTime: "35-45 min",
    rating: 4.6,
    reviewCount: 76,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "321 Elm Street",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11201"
    },
    openingHours: {
      Monday: "Closed",
      Tuesday: "4:00 PM - 10:00 PM",
      Wednesday: "4:00 PM - 10:00 PM",
      Thursday: "4:00 PM - 10:00 PM",
      Friday: "4:00 PM - 11:00 PM",
      Saturday: "12:00 PM - 11:00 PM",
      Sunday: "12:00 PM - 9:00 PM"
    },
    featured: true
  },
  {
    name: "Taco Fiesta",
    description: "Authentic Mexican street tacos and margaritas",
    cuisineType: "Mexican",
    deliveryTime: "20-30 min",
    rating: 4.4,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "567 Oak Street",
      city: "Queens",
      state: "NY",
      zipCode: "11355"
    },
    openingHours: {
      Monday: "11:00 AM - 9:00 PM",
      Tuesday: "11:00 AM - 9:00 PM",
      Wednesday: "11:00 AM - 9:00 PM",
      Thursday: "11:00 AM - 10:00 PM",
      Friday: "11:00 AM - 11:00 PM",
      Saturday: "10:00 AM - 11:00 PM",
      Sunday: "10:00 AM - 9:00 PM"
    },
    featured: false
  },
  {
    name: "Mediterranean Grill",
    description: "Healthy Mediterranean dishes with fresh ingredients",
    cuisineType: "Mediterranean",
    deliveryTime: "30-35 min",
    rating: 4.9,
    reviewCount: 145,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "890 Pine Street",
      city: "Manhattan",
      state: "NY",
      zipCode: "10016"
    },
    openingHours: {
      Monday: "10:00 AM - 9:00 PM",
      Tuesday: "10:00 AM - 9:00 PM",
      Wednesday: "10:00 AM - 9:00 PM",
      Thursday: "10:00 AM - 10:00 PM",
      Friday: "10:00 AM - 11:00 PM",
      Saturday: "9:00 AM - 11:00 PM",
      Sunday: "9:00 AM - 9:00 PM"
    },
    featured: true
  },
  {
    name: "Veggie Heaven",
    description: "Creative vegetarian and vegan dishes",
    cuisineType: "Vegetarian",
    deliveryTime: "25-35 min",
    rating: 4.6,
    reviewCount: 92,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "234 Maple Avenue",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11205"
    },
    openingHours: {
      Monday: "11:00 AM - 9:00 PM",
      Tuesday: "11:00 AM - 9:00 PM",
      Wednesday: "11:00 AM - 9:00 PM",
      Thursday: "11:00 AM - 10:00 PM",
      Friday: "11:00 AM - 10:00 PM",
      Saturday: "10:00 AM - 10:00 PM",
      Sunday: "10:00 AM - 8:00 PM"
    },
    featured: false
  },
  {
    name: "BBQ Pit",
    description: "Slow-smoked meats and classic southern sides",
    cuisineType: "Barbecue",
    deliveryTime: "40-50 min",
    rating: 4.3,
    reviewCount: 118,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "678 Cedar Road",
      city: "Bronx",
      state: "NY",
      zipCode: "10451"
    },
    openingHours: {
      Monday: "Closed",
      Tuesday: "12:00 PM - 9:00 PM",
      Wednesday: "12:00 PM - 9:00 PM",
      Thursday: "12:00 PM - 10:00 PM",
      Friday: "12:00 PM - 11:00 PM",
      Saturday: "11:00 AM - 11:00 PM",
      Sunday: "11:00 AM - 8:00 PM"
    },
    featured: false
  },
  {
    name: "Seafood Harbor",
    description: "Fresh seafood caught daily from local waters",
    cuisineType: "Seafood",
    deliveryTime: "35-45 min",
    rating: 4.7,
    reviewCount: 103,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "345 Harbor Drive",
      city: "Staten Island",
      state: "NY",
      zipCode: "10301"
    },
    openingHours: {
      Monday: "4:00 PM - 10:00 PM",
      Tuesday: "4:00 PM - 10:00 PM",
      Wednesday: "4:00 PM - 10:00 PM",
      Thursday: "4:00 PM - 11:00 PM",
      Friday: "4:00 PM - 11:00 PM",
      Saturday: "12:00 PM - 11:00 PM",
      Sunday: "12:00 PM - 9:00 PM"
    },
    featured: true
  },
  {
    name: "Deli Corner",
    description: "Classic New York deli sandwiches and comfort food",
    cuisineType: "Deli",
    deliveryTime: "20-25 min",
    rating: 4.2,
    reviewCount: 85,
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "567 Delancey Street",
      city: "Manhattan",
      state: "NY",
      zipCode: "10002"
    },
    openingHours: {
      Monday: "8:00 AM - 8:00 PM",
      Tuesday: "8:00 AM - 8:00 PM",
      Wednesday: "8:00 AM - 8:00 PM",
      Thursday: "8:00 AM - 9:00 PM",
      Friday: "8:00 AM - 9:00 PM",
      Saturday: "9:00 AM - 6:00 PM",
      Sunday: "Closed"
    },
    featured: false
  },
  // Additional restaurants with unique images
  {
    name: "Curry House",
    description: "Authentic Indian curries and tandoori specialties",
    cuisineType: "Indian",
    deliveryTime: "30-40 min",
    rating: 4.8,
    reviewCount: 134,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Spice Lane",
      city: "Jersey City",
      state: "NJ",
      zipCode: "07302"
    },
    featured: true
  },
  {
    name: "Ramen World",
    description: "Authentic Japanese ramen with rich broths",
    cuisineType: "Japanese",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviewCount: 121,
    image: "https://images.unsplash.com/photo-1623341215095-6a4e3e4d1e49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1623341215095-6a4e3e4d1e49?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Noodle Street",
      city: "Hoboken",
      state: "NJ",
      zipCode: "07030"
    },
    featured: false
  },
  {
    name: "Steak Masters",
    description: "Premium cuts of steak cooked to perfection",
    cuisineType: "Steakhouse",
    deliveryTime: "40-50 min",
    rating: 4.9,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1607116667981-ffbcba5d0d0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1607116667981-ffbcba5d0d0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Prime Avenue",
      city: "Newark",
      state: "NJ",
      zipCode: "07102"
    },
    featured: true
  },
  {
    name: "Poke Paradise",
    description: "Fresh Hawaiian poke bowls with premium ingredients",
    cuisineType: "Hawaiian",
    deliveryTime: "20-30 min",
    rating: 4.5,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Ocean Drive",
      city: "Long Beach",
      state: "NY",
      zipCode: "11561"
    },
    featured: false
  },
  {
    name: "Pizza Planet",
    description: "Creative pizzas with unique topping combinations",
    cuisineType: "Pizza",
    deliveryTime: "25-35 min",
    rating: 4.6,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Cheese Lane",
      city: "Brooklyn",
      state: "NY",
      zipCode: "11222"
    },
    featured: true
  },
  {
    name: "Dumpling House",
    description: "Handmade dumplings with traditional fillings",
    cuisineType: "Chinese",
    deliveryTime: "30-40 min",
    rating: 4.7,
    reviewCount: 107,
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Wok Street",
      city: "Flushing",
      state: "NY",
      zipCode: "11354"
    },
    featured: false
  },
  {
    name: "Creperie",
    description: "Authentic French crepes with sweet and savory fillings",
    cuisineType: "French",
    deliveryTime: "25-35 min",
    rating: 4.8,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Bistro Avenue",
      city: "Manhattan",
      state: "NY",
      zipCode: "10012"
    },
    featured: false
  },
  {
    name: "Korean BBQ",
    description: "Interactive Korean barbecue experience",
    cuisineType: "Korean",
    deliveryTime: "35-45 min",
    rating: 4.6,
    reviewCount: 132,
    image: "https://images.unsplash.com/photo-1611330500121-d9439ddc3d2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1611330500121-d9439ddc3d2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Kimchi Street",
      city: "Fort Lee",
      state: "NJ",
      zipCode: "07024"
    },
    featured: true
  },
  {
    name: "Greek Taverna",
    description: "Traditional Greek dishes with Mediterranean flavors",
    cuisineType: "Greek",
    deliveryTime: "30-40 min",
    rating: 4.4,
    reviewCount: 97,
    image: "https://images.unsplash.com/photo-1633332750468-0a1e3f0a9c1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1633332750468-0a1e3f0a9c1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "234 Olive Road",
      city: "Astoria",
      state: "NY",
      zipCode: "11102"
    },
    featured: false
  },
  {
    name: "Vegan Vibes",
    description: "Innovative plant-based cuisine for everyone",
    cuisineType: "Vegan",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviewCount: 115,
    image: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "567 Plant Street",
      city: "Williamsburg",
      state: "NY",
      zipCode: "11211"
    },
    featured: true
  },
  // Remaining 10 restaurants with unique images
  {
    name: "Cajun Kitchen",
    description: "Spicy Cajun and Creole specialties",
    cuisineType: "Cajun",
    deliveryTime: "35-45 min",
    rating: 4.3,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Bayou Road",
      city: "New Orleans",
      state: "LA",
      zipCode: "70112"
    },
    featured: false
  },
  {
    name: "Burrito Brothers",
    description: "Oversized burritos with fresh ingredients",
    cuisineType: "Mexican",
    deliveryTime: "20-30 min",
    rating: 4.5,
    reviewCount: 102,
    image: "https://images.unsplash.com/photo-1519183073328-330cc6ead67d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1519183073328-330cc6ead67d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Guacamole Lane",
      city: "San Diego",
      state: "CA",
      zipCode: "92101"
    },
    featured: false
  },
  {
    name: "Pho King",
    description: "Authentic Vietnamese pho and noodle soups",
    cuisineType: "Vietnamese",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviewCount: 126,
    image: "https://images.unsplash.com/photo-1610878180933-123728745d22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1610878180933-123728745d22?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Broth Street",
      city: "Westminster",
      state: "CA",
      zipCode: "92683"
    },
    featured: true
  },
  {
    name: "Brunch Spot",
    description: "All-day brunch with creative breakfast dishes",
    cuisineType: "Breakfast",
    deliveryTime: "20-30 min",
    rating: 4.8,
    reviewCount: 143,
    image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Pancake Avenue",
      city: "Chicago",
      state: "IL",
      zipCode: "60601"
    },
    featured: true
  },
  {
    name: "Dessert Den",
    description: "Decadent desserts and sweet treats",
    cuisineType: "Dessert",
    deliveryTime: "20-25 min",
    rating: 4.9,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1565958011705-4f0eeedc7e1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1565958011705-4f0eeedc7e1f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Sugar Lane",
      city: "Boston",
      state: "MA",
      zipCode: "02108"
    },
    featured: false
  },
  {
    name: "Halal Grill",
    description: "Authentic halal street food favorites",
    cuisineType: "Middle Eastern",
    deliveryTime: "25-35 min",
    rating: 4.6,
    reviewCount: 112,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Kebab Street",
      city: "Queens",
      state: "NY",
      zipCode: "11368"
    },
    featured: false
  },
  {
    name: "Soul Food Kitchen",
    description: "Comforting soul food classics",
    cuisineType: "Southern",
    deliveryTime: "30-40 min",
    rating: 4.4,
    reviewCount: 96,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1612927601601-6638404737ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Comfort Road",
      city: "Harlem",
      state: "NY",
      zipCode: "10026"
    },
    featured: false
  },
  {
    name: "Pasta Paradise",
    description: "Fresh pasta dishes with homemade sauces",
    cuisineType: "Italian",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviewCount: 131,
    image: "https://images.unsplash.com/photo-1603105037880-8805c6599a7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1603105037880-8805c6599a7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Alfredo Lane",
      city: "Little Italy",
      state: "NY",
      zipCode: "10013"
    },
    featured: true
  },
  {
    name: "Smoothie Bowl",
    description: "Nutritious acai and smoothie bowls",
    cuisineType: "Healthy",
    deliveryTime: "15-20 min",
    rating: 4.5,
    reviewCount: 87,
    image: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1497534446932-c925b458314e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "789 Berry Street",
      city: "Santa Monica",
      state: "CA",
      zipCode: "90401"
    },
    featured: false
  },
  {
    name: "Tandoori Grill",
    description: "Authentic North Indian tandoori specialties",
    cuisineType: "Indian",
    deliveryTime: "30-40 min",
    rating: 4.6,
    reviewCount: 109,
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "123 Curry Lane",
      city: "Edison",
      state: "NJ",
      zipCode: "08817"
    },
    featured: false
  },
  {
    name: "Tapas Bar",
    description: "Spanish small plates perfect for sharing",
    cuisineType: "Spanish",
    deliveryTime: "30-40 min",
    rating: 4.8,
    reviewCount: 94,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&crop=entropy",
    bannerImage: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400&crop=entropy",
    address: {
      street: "456 Sangria Street",
      city: "Barcelona",
      state: "Spain",
      zipCode: "08001"
    },
    featured: true
  }
];



fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
