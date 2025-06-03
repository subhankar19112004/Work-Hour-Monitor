


import { useState, useEffect } from 'react';

const useInactivity = (timeout =  5 * 60 * 1000) => {
  const [isInactive, setIsInactive] = useState(false);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      console.log('User is active'); // Debug log to see if activity is detected
      setLastActiveTime(Date.now());
      if (isInactive) {
        setIsInactive(false); // Reset inactivity if user interacts
      }
    };

    const handleTabSwitch = () => {
      console.log('Tab/window switch or blur detected'); // Optional debug
      setLastActiveTime(Date.now());
    };

    // Activity events
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);

    // Tab/window change detection
    window.addEventListener('blur', handleTabSwitch);
    window.addEventListener('focus', handleTabSwitch);

    const checkInactivity = setInterval(() => {
      if (Date.now() - lastActiveTime > timeout) {
        console.log('User is inactive'); // Debug log
        setIsInactive(true);
      }
    }, 1000);

    return () => {
      clearInterval(checkInactivity);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      window.removeEventListener('blur', handleTabSwitch);
      window.removeEventListener('focus', handleTabSwitch);
    };
  }, [lastActiveTime, isInactive, timeout]);

  return isInactive;
};

export default useInactivity;

