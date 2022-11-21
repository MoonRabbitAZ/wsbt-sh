const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bundleSchema = new Schema(
  {
    bundleId: { type: String, required: true, unique: true },
    prices: { type: Array, required: true },
    endPrice: { type: Array, required: true },
    rewards: { type: Array, required: true },
    isRewardDistributed: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Bundle = mongoose.model("bundle", bundleSchema);
module.exports = Bundle;
