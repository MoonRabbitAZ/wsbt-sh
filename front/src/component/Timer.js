import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import socketIOClient from "socket.io-client";

export const Timer = ({ type, page }) => {
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        const socket = socketIOClient(process.env.REACT_APP_URL);

        socket.on("broadcast", data => {
            setTimestamp(data);
        });

        // CLEAN UP THE EFFECT
        return () => socket.disconnect();
        //

    }, []);
    
    return (
        
        page !== "assets" ?
            timestamp ?
                <div className='spe_time'>{type == "stakePeriod" ? timestamp.currentPeriodEnd : timestamp.nextPeriodStart}</div>
                : <div className='spe_time'>-</div>
        : <div className="time">{timestamp.currentPeriodEnd}</div>
    );
}




