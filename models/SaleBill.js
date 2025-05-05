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

const saleBillSchema = new mongoose.Schema({
  location: String,
  store: String,
  consultant: String,
  name: String,
  mobile: String,
  age: Number,
  gender: String,
  products: [productSchema],
  salestaxname: Number,
  total: Number,
  discountPercentage: Number,
  discountAmount: Number,
  discount: Number,
  additionalCharges: Number,
  amountReceivable: Number,
  amountReceived: Number,
  due: Number,
  cashTendered: Number,
  Balance: Number,
  paymentMode: String,
  paymentType: String,
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SaleBill", saleBillSchema);
