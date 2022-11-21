const mongoose = require("mongoose");

const schema = new mongoose.Schema(
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

module.exports = mongoose.model("bundle", schema);

