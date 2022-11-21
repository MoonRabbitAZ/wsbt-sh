const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        walletAddress: { type: String, required: true },
        username: { type: String, default: ''}
    },
    {
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        },
    }
);

module.exports = mongoose.model("nft_user", schema);

