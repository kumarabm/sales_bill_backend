const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  manufacturer: String,
  batch: String,
  expiry: String,
  qty: Number,
  price: Number,
  gst: Number,
  discount: Number,
  total: Number,
});

module.exports = mongoose.model("products", productSchema);