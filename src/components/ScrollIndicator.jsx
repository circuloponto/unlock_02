import React, { useState, useEffect } from 'react';
import styles from './ScrollIndicator.module.css';

const ScrollIndicator = ({ constraints }) => {
  const [currentPosition, setCurrentPosition] = useState('');
  const [opacity, setOpacity] = useState(1);
  
  // Get available directions in clockwise order
  const getOrderedDirections = () => {
    const directions = ['up', 'right', 'down', 'left'];
    return directions.filter(dir => constraints[dir]);
  };

  useEffect(() => {
    const availableDirections = getOrderedDirections();
    
    if (availableDirections.length === 0) {
      setCurrentPosition('');
      return;
    }

    let currentIndex = 0;
    setCurrentPosition(availableDirections[0]);

    if (availableDirections.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % availableDirections.length;
        const next = availableDirections[nextIndex];
        
        // Fade out
        setOpacity(0);
        
        // Change position after fade out
        setTimeout(() => {
          setCurrentPosition(next);
          // Fade in
          setOpacity(1);
        }, 200);
        
        currentIndex = nextIndex;
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [constraints]);

  return (
    <div className={`${styles.container} scroll-indicator-container`}>
      <div className={styles.mainCircle}>
        <div 
          className={`
            ${styles.directionDot} 
            ${currentPosition ? styles[`${currentPosition}Dot`] : ''}
          `}
          style={{ opacity }}
        />
      </div>
    </div>
  );
};

export default ScrollIndicator;
