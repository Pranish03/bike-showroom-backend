import mongoose from "mongoose";

const bikeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String, required: true },
    details: { type: String },
  },
  {
    timestamps: true,
  },
);

export const Bike = mongoose.model("Bike", bikeSchema);
