import React, { useState, useEffect } from 'react';

const getTodayInBSTForInput = () => {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const londonTime = new Date(
    today.toLocaleString('en-GB', { timeZone: 'Europe/London' })
  );

  const year = londonTime.getFullYear();
  const month = String(londonTime.getMonth() + 1).padStart(2, '0');
  const day = String(londonTime.getDate()).padStart(2, '0');
  const hour = String(londonTime.getHours()).padStart(2, '0');
  const minute = String(londonTime.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const CurrentTime = () => {
  const [currentToday, setCurrentToday] = useState(getTodayInBSTForInput());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentToday(getTodayInBSTForInput());
    }, 30000); // update every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <p>Current Time: {currentToday}</p>
    </div>
  );
};

export default CurrentTime;
