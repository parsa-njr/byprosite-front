
import React, { useEffect, useState } from 'react';



const CountdownTimer = ({ initialTime, resendCodeFn }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    // setTimeRemaining(initialTime); //set the time when initial time prop changes.
    const timeParts = initialTime.split(':');
    console.log(timeParts)
    const minutes = parseInt(timeParts[0], 10);
    const seconds = parseInt(timeParts[1], 10);
    const totalSeconds = minutes * 60 + seconds;
    setTimeRemaining(totalSeconds);
  },[initialTime])

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timerInterval);
          return 0;
        } else {
          return prevTime - 1;
        }
      });
      
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="text-[#008eb2]">
      {timeRemaining === 0 ? (
        <button onClick={resendCodeFn} className="textsm" type="button">
          دریافت مجدد
        </button>
      ) : (
        <p>{`${seconds < 10 ? '0' + seconds : seconds} : ${minutes < 10 ? '0' + minutes : minutes}`}</p>
      )}
    </div>
  );
};

export default CountdownTimer;