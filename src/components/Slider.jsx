import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Slider.module.css';
import ScrollIndicator from './ScrollIndicator';

const Slider = ({ 
  slides, 
  currentVerticalIndex, 
  setCurrentVerticalIndex, 
  currentHorizontalIndex, 
  setCurrentHorizontalIndex,
  isMenuOpen // Add isMenuOpen as a prop
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  // Navigation constraints for each slide position
  const navigationConstraints = {
    "0.0": { up: false, down: true, left: false, right: false },   // Bottom only
    "1.0": { up: true, down: false, left: false, right: true },    // Top and right
    "1.1": { up: false, down: false, left: true, right: true },    // Left and right
    "1.2": { up: false, down: true, left: true, right: false },    // Left and bottom
    "2.0": { up: true, down: true, left: false, right: false },    // Top and bottom
    "3.0": { up: true, down: false, left: false, right: true },    // Top and right
    "3.1": { up: false, down: true, left: true, right: false },    // Left and bottom
    "4.0": { up: true, down: false, left: false, right: false },   // Top only
  };

  // Get current slide constraints
  const getCurrentConstraints = () => {
    const key = `${currentVerticalIndex}.${currentHorizontalIndex}`;
    return navigationConstraints[key] || { up: false, down: false, left: false, right: false };
  };

  // Calculate viewport position based on current slide
  const getViewportPosition = () => {
    if (currentVerticalIndex === 0) {
      return { x: 0, y: 0 };
    } else if (currentVerticalIndex === 1) {
      return { x: currentHorizontalIndex * 100, y: 100 };
    } else if (currentVerticalIndex === 2) {
      return { x: 200, y: 200 };
    } else if (currentVerticalIndex === 3) {
      return { x: 200 + (currentHorizontalIndex * 100), y: 300 };
    } else if (currentVerticalIndex === 4) {
      return { x: 300, y: 400 };
    }
    return { x: 0, y: 0 };
  };

  const { x, y } = getViewportPosition();
  const viewportStyle = {
    transform: `translate3d(${-x}vw, ${-y}vh, 0)`
  };

  const handleNavigation = useCallback((direction) => {
    if (isScrolling || isMenuOpen) return;  // Add isMenuOpen check
    
    const constraints = getCurrentConstraints();
    if (!constraints[direction]) return;

    setIsScrolling(true);

    switch (direction) {
      case 'up':
        if (currentVerticalIndex === 4) {
          setCurrentVerticalIndex(3);
          setCurrentHorizontalIndex(1); // Go to 3.1
        } else if (currentVerticalIndex === 2) {
          setCurrentVerticalIndex(1);
          setCurrentHorizontalIndex(2); // Go to 1.2 instead of 1.0
        } else {
          setCurrentVerticalIndex(prev => prev - 1);
        }
        break;
      case 'down':
        if (currentVerticalIndex === 3 && currentHorizontalIndex === 1) {
          setCurrentVerticalIndex(4);
          setCurrentHorizontalIndex(0); // Go to 4.0
        } else if (currentVerticalIndex === 1 && currentHorizontalIndex === 2) {
          setCurrentVerticalIndex(2);
          setCurrentHorizontalIndex(0); // Coming from 1.2 to 2.0
        } else {
          setCurrentVerticalIndex(prev => prev + 1);
          setCurrentHorizontalIndex(0);
        }
        break;
      case 'left':
        setCurrentHorizontalIndex(prev => prev - 1);
        break;
      case 'right':
        setCurrentHorizontalIndex(prev => prev + 1);
        break;
    }

    setTimeout(() => setIsScrolling(false), 850);
  }, [
    isScrolling,
    currentVerticalIndex,
    currentHorizontalIndex,
    setCurrentVerticalIndex,
    setCurrentHorizontalIndex,
    isMenuOpen
  ]);

  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;
    
    const yDiff = touchStartY.current - touchEndY;
    const xDiff = touchStartX.current - touchEndX;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > 50 && getCurrentConstraints().right) {
        handleNavigation('right');
      } else if (xDiff < -50 && getCurrentConstraints().left) {
        handleNavigation('left');
      }
    } else {
      if (yDiff > 50 && getCurrentConstraints().down) {
        handleNavigation('down');
      } else if (yDiff < -50 && getCurrentConstraints().up) {
        handleNavigation('up');
      }
    }
  }, [handleNavigation, getCurrentConstraints]);

  const handleMouseWheel = useCallback((e) => {
    e.preventDefault();
    console.log('Menu is open:', isMenuOpen); // Log menu state
    
    const deltaY = e.wheelDelta || -e.deltaY || -e.detail;
    const verticalDelta = Math.max(-1, Math.min(1, deltaY));
    
    const constraints = getCurrentConstraints();
    if (verticalDelta < 0 && constraints.right) {
      handleNavigation('right');
    } else if (verticalDelta > 0 && constraints.left) {
      handleNavigation('left');
    } else if (verticalDelta < 0 && constraints.down) {
      handleNavigation('down');
    } else if (verticalDelta > 0 && constraints.up) {
      handleNavigation('up');
    }
  }, [handleNavigation, getCurrentConstraints, isMenuOpen]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleNavigation('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleNavigation('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleNavigation('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNavigation('right');
        break;
    }
  }, [handleNavigation]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      handleMouseWheel(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', e => e.preventDefault());
    };
  }, [handleKeyDown, handleMouseWheel]);

  return (
    <div
      className={styles.container}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className={styles.viewport} style={viewportStyle}>
        {slides.map((slide, vIndex) => {
          let left = '0vw';
          let top = '0vh';
          
          if (vIndex === 0) {
            left = '0vw';
            top = '0vh';
          } else if (vIndex === 1) {
            left = '0vw';
            top = '100vh';
          } else if (vIndex === 2) {
            left = '200vw';
            top = '200vh';
          } else if (vIndex === 3) {
            left = '200vw';
            top = '300vh';
          } else if (vIndex === 4) {
            left = '300vw';
            top = '400vh';
          }

          return (
            <section 
              key={vIndex} 
              className={`${styles.section} ${currentVerticalIndex === vIndex ? styles.active : ''}`}
              style={{ left, top }}
            >
              {slide.horizontal ? (
                <div className={styles.horizontalContainer}>
                  {slide.horizontal.map((content, hIndex) => (
                    <div
                      key={hIndex}
                      className={styles.horizontalSection}
                    >
                      {content}
                    </div>
                  ))}
                </div>
              ) : (
                slide.content
              )}
            </section>
          );
        })}
      </div>
      <ScrollIndicator constraints={getCurrentConstraints()} />
    </div>
  );
};

export default Slider;
