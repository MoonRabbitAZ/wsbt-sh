const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    wallet_address: { type: String, required: true },
    user_name: { type: String,default:''}
    // user_bio: { type: String,default:''},
    // user_email: { type: String,default:''},
    // user_image: { type: String,default:'./../../../assets/images/userbig.svg'},
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const NFTUser = mongoose.model("nft_user", usersSchema);
module.exports = NFTUser;
