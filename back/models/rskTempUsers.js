const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var Float = require("mongoose-float").loadType(mongoose, 8);

const tempUsersSchema = new Schema(
  {
    address: { type: String, required: true },
    bundleId: { type: String, required: true },
    predicted: {
      type: Array,
      default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    },
    prices: {
      type: Array,
      default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    },
    assetsStaked: {
      type: Array,
      default: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    },
    balance: { type: Float, required: true },
    reward: { type: String, default: "0" },
    isBalanceUpdated: { type: Boolean, default: false },
    balanceUpdatedAt: { type: Date },
    rank: { type: Number, default: 0 },
    performance: { type: String },
    balUpdateHash: { type: String },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const TempUser = mongoose.model("rsk_temp_user", tempUsersSchema);
module.exports = TempUser;
