/**
 * @author Ashish Bhalodia
 */
/*#################################            Load modules start            ########################################### */

const ObjectId = require('mongoose').Types.ObjectId
const utils = require("../utils/utils")
const fetchPreviousEnd = require("../utils/fetchPreviousEnd")
const fetchStackingEnd = require("../utils/fetchStakingEnds")
const fetchBundleId = require("../utils/fetchBundleId")



/*#################################            Load modules end            ########################################### */

// Connect Socket Server
async function connect(server) {
    const Server = require("socket.io")

    io = Server(server, {
        cors: {
            origin: "*",
        }
    });


    let interval;
    io.sockets.on('connection', async (socket) => {

        let bundleId = (await fetchBundleId())
        bundleId = Math.round(bundleId);

        let previousEnd = await fetchPreviousEnd(bundleId);
        let stakingEnd = await fetchStackingEnd(bundleId);
        //console.log({previousEnd, stakingEnd})
        //console.log("New client connected");
        if (interval) {
            clearInterval(interval);
        }
        interval = setInterval(() => EmitServerTimestamp(io, previousEnd, stakingEnd), 1000);
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            //clearInterval(interval);
        });
    })

    const EmitServerTimestamp = async (io, previousEnd, stakingEnd) => {

        let currentTS = new Date().getTime()

        let stakingEndTS = "00:00:00"
        if (new Date(stakingEnd).getTime() >= currentTS) {
            stakingEndTS = utils.getTimestampDiff(new Date(stakingEnd).getTime())
        }

        let previousEndTS = "00:00:00"
        if (new Date(previousEnd).getTime() >= currentTS) {
            previousEndTS = utils.getTimestampDiff(new Date(previousEnd).getTime())
        }

        let response = {}
        response['currentPeriodEnd'] = stakingEndTS
        response['nextPeriodStart'] = previousEndTS

        // Emitting a new message. Will be consumed by the client
        io.emit("broadcast", response);
    }
}

module.exports = {
    connect
}

