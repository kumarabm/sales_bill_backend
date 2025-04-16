const express = require("express");
const router = express.Router();
const SaleBill = require("../models/SaleBill");
const Products = require("../models/product");
const mongoose = require("mongoose");

// Helper function to validate mobile number
const isValidMobile = (mobile) => {
  return /^\d{10}$/.test(mobile);  // Check if it's a 10-digit number
};

// Create Sale Bill
// router.post("/newcustomer", async (req, res) => {
//   try {
//     const { mobile, products, ...rest } = req.body;

//     if (!isValidMobile(mobile)) {
//       return res.status(400).json({ message: "Invalid mobile number format" });
//     }

//     // Ensure that products is an array, even if it's empty
//     const validProducts = Array.isArray(products) ? products : [];

//     const existingCustomer = await SaleBill.findOne({ mobile: mobile });

//     if (existingCustomer) {
//       // Add new products to the existing array
//       existingCustomer.products.push(...validProducts);

//       // Optionally: Update other fields (name, age, etc.)
//       Object.assign(existingCustomer, rest);

//       const updated = await existingCustomer.save();
//       return res.status(200).json(updated);
//     }

//     // If it's a new customer, create a new sale bill
//     const newCustomer = new SaleBill({
//       mobile,
//       products: validProducts,
//       ...rest
//     });
//     const saved = await newCustomer.save();
//     res.status(201).json(saved);

//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.post("/newcustomer", async (req, res) => {
  try {
    const { mobile, products, ...rest } = req.body;

    // Validate the mobile number format
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    // Ensure that products is an array, even if it's empty
    const validProducts = Array.isArray(products) ? products : [];

    // Fetch existing customer (SaleBill) by mobile number
    const existingCustomer = await SaleBill.findOne({ mobile: mobile });

    // Fetch the product details for each product name in the `products` array
    const productNames = validProducts.map(product => product.name); // Assuming 'name' is passed in products array

    const productDetails = await Products.find({ name: { $in: productNames } }); // Assuming products have a 'name' field

    // Create a map of product details by name for quick lookup
    const productMap = productDetails.reduce((acc, product) => {
      acc[product.name] = product;
      return acc;
    }, {});

    // Add full product details to the products array
    const productsWithDetails = validProducts.map(product => {
      const productDetail = productMap[product.name];
      if (productDetail) {
        return {
          ...product,
          ...productDetail.toObject() // Merge product details (you can customize which fields to merge)
        };
      }
      return product; // If no match, return the original product (you can also handle missing products as needed)
    });

    if (existingCustomer) {
      // Add new products to the existing array
      existingCustomer.products.push(...productsWithDetails);

      // Optionally: Update other fields (name, age, etc.)
      Object.assign(existingCustomer, rest);

      const updated = await existingCustomer.save();
      return res.status(200).json(updated);
    }

    // If it's a new customer, create a new sale bill
    const newCustomer = new SaleBill({
      mobile,
      products: productsWithDetails,
      ...rest
    });

    const saved = await newCustomer.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get All Sale Bills
router.get("/", async (req, res) => {
  try {
    const bills = await SaleBill.find();
    res.json(bills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Customer by Mobile
router.get("/customer/:mobile", async (req, res) => {
  try {
    const { mobile } = req.params;

    // Validate mobile format
    if (!isValidMobile(mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    console.log("Searching customer with mobile:", mobile);

    // Find all sale bills for this customer
    const customerRecords = await SaleBill.find({ mobile });

    if (!customerRecords || customerRecords.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get customer details from the first record (assuming all are the same)
    const { name, age, gender, consultant } = customerRecords[0];

    // Send only customer details (no products)
    res.json({ name, age, gender, consultant });

  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ message: err.message });
  }
});

//Get Products
router.get("/product/:name", async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name,"name");
    

    // Find product by name in the database
    const product = await Products.find({ name });
    console.log(product,"prod");
    

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Send product details back
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
