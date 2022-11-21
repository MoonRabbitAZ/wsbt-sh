

const RSKUser = require("../models/rskUser");
const RSKBundle = require("../models/rskBundle");

const updateBalance = require("../rskUtils/updateBalance");

let listener = RSKBundle.watch();

listener.on("change", async (next) => {
    try {
        if (next.operationType == "insert") {
            let doc = next.fullDocument;
            let bundleId = Math.round(parseInt(doc.bundleId) - 1);
            console.log("bundleId", bundleId);
            let users = await RSKUser.find({ bundleId: bundleId });
            if (users.length > 0) {
                await updateBalance(bundleId);
                await RSKBundle.findOneAndUpdate(
                    { bundleId: bundleId },
                    { isRewardDistributed: true }
                );
                console.log("Rewards Distributed");
            } else console.log("No users staked in the previous pool");
        }
    } catch (error) {
        console.log("Reward distribution error", error);
    }
});
