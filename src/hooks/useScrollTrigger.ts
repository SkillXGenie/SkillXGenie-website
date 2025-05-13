import { useState, useEffect } from 'react';

interface ScrollTriggerOptions {
  threshold?: number;
  delay?: number;
  once?: boolean;
}

export const useScrollTrigger = ({
  threshold = 300,
  delay = 0,
  once = true
}: ScrollTriggerOptions = {}) => {
  const [triggered, setTriggered] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      if (once && hasShown) return;

      const scrollY = window.scrollY;
      if (scrollY > threshold) {
        if (delay) {
          timeoutId = setTimeout(() => {
            setTriggered(true);
            setHasShown(true);
          }, delay);
        } else {
          setTriggered(true);
          setHasShown(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold, delay, once, hasShown]);

  return {
    triggered,
    setTriggered
  };
};