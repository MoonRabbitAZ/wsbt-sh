const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        address: { type: String, required: true },
        bundleId: { type: String, required: true },
        predicted: {
            type: Array,
            default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        },
        prices: {
            type: Array,
            default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        },
        assetsStaked: {
            type: Array,
            default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
        },
        balance: { type: String, required: true },
        reward: String,
        isBalanceUpdated: { type: Boolean, default: false },
        balanceUpdatedAt: Date,
        rank: { type: Number, default: 0 },
        performance: String,
        balUpdateHash: String,
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

module.exports = mongoose.model("user", schema);
