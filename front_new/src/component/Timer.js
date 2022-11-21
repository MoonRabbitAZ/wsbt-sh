import React, { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export const Timer = ({ endAtSeconds, updateBundleId, timerTxt, waitText }) => {
  const [isEnd, setIsEnd] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endAtSeconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, endAtSeconds]);

  const calculateTimeLeft = (endAt) => {
    if (endAt === undefined) return timeLeft;

    let difference = new Date(endAt * 1000) - new Date();
    if (difference <= 0) {
      setIsEnd(true);
      
      // Try to fetch new bundleId each 10 seconds
      if (updateBundleId && Math.floor(difference / 1000) % 10 === 0) {
        updateBundleId();
      }
    } else {
      setIsEnd(false);
    }

    const hours = String(Math.floor((difference / (1000 * 60 * 60)) % 24));
    const minutes = String(Math.floor((difference / 1000 / 60) % 60));
    const seconds = String(Math.floor((difference / 1000) % 60));

    return {
      // days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: hours.length === 1 ? `0${hours}` : hours,
      minutes: minutes.length === 1 ? `0${minutes}` : minutes,
      seconds: seconds.length === 1 ? `0${seconds}` : seconds
    };
  };

  return (
    <>
      {!isEnd ? (
        <>
         <p className="mb-3">{timerTxt}</p>
          <div>
            <span>{timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}</span>
          </div>
        </>
      ) : (
        <>
          <p className="mb-3">{waitText}</p>
          <div><Spinner animation="border" /></div>
        </>
      )}
    </>
  );
};
