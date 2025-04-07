import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const intervals = ['.', '..', '...', ''];
    let index = 0;

    const intervalId = setInterval(() => {
      setDots(intervals[index]);
      index = (index + 1) % intervals.length;
    }, 500);

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
  }, []);

  return <div>Loading{dots}</div>;
};

export default Loading;
