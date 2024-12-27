import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './Slider.module.css';
import ScrollIndicator from './ScrollIndicator';

const Slider = ({ 
  slides, 
  currentVerticalIndex, 
  setCurrentVerticalIndex, 
  currentHorizontalIndex, 
  setCurrentHorizontalIndex,
  isMenuOpen
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const lastNavigatedPosition = useRef({ vertical: 0, horizontal: 0 });
  const hasNavigatedThisTouch = useRef(false);
  const movementDirection = useRef(null); // 'horizontal' or 'vertical'

  // Navigation constraints for each slide position
  const navigationConstraints = {
    "0.0": { up: true, down: true, left: false, right: false },    // Can go up to last slide or down to 1.0
    "1.0": { up: true, down: false, left: false, right: true },     // Can go up to 0.0 or right to 1.1
    "1.1": { up: false, down: false, left: true, right: true },     // Can go left to 1.0 or right to 1.2
    "1.2": { up: false, down: true, left: true, right: false },     // Can go left to 1.1 or down to 2.0
    "2.0": { up: true, down: true, left: false, right: false },     // Can go up to 1.2 or down to 3.0
    "3.0": { up: true, down: false, left: false, right: true },     // Can go up to 2.0 or right to 3.1
    "3.1": { up: false, down: true, left: true, right: false },     // Can go left to 3.0 or down to 4.0
    "4.0": { up: true, down: true, left: false, right: false },     // Can go up to 3.1 or down to 5.0
    "5.0": { up: true, down: true, left: false, right: false },     // Can go up to 4.0 or down to 0.0
  };

  // Get current slide constraints
  const getCurrentConstraints = () => {
    const key = `${currentVerticalIndex}.${currentHorizontalIndex}`;
    return navigationConstraints[key] || { up: false, down: false, left: false, right: false };
  };

  const handleNavigation = useCallback((direction) => {
    if (isScrolling || isMenuOpen) return;
    
    const constraints = getCurrentConstraints();
    if (!constraints[direction]) return;

    setIsScrolling(true);

    // Store current position before navigation
    const fromPosition = { vertical: currentVerticalIndex, horizontal: currentHorizontalIndex };

    switch (direction) {
      case 'up':
        if (currentVerticalIndex === 1 && currentHorizontalIndex === 0) {
          // From 1.0 to 0.0
          setCurrentVerticalIndex(0);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 2) {
          // From 2.0 to 1.2
          setCurrentVerticalIndex(1);
          setCurrentHorizontalIndex(2);
        } else if (currentVerticalIndex === 3 && currentHorizontalIndex === 0) {
          // From 3.0 to 2.0
          setCurrentVerticalIndex(2);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 4) {
          // From 4.0 to 3.1
          setCurrentVerticalIndex(3);
          setCurrentHorizontalIndex(1);
        } else if (currentVerticalIndex === 5) {
          // From 5.0 to 4.0
          setCurrentVerticalIndex(4);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex > 0) {
          setCurrentVerticalIndex(currentVerticalIndex - 1);
          // Keep horizontal index unless it's invalid for the new vertical position
          if (currentVerticalIndex === 1) {
            setCurrentHorizontalIndex(0); // Reset to 0 when moving up from section 1
          }
        }
        break;

      case 'down':
        if (currentVerticalIndex === 0) {
          // From 0.0 to 1.0
          setCurrentVerticalIndex(1);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 1 && currentHorizontalIndex === 2) {
          // From 1.2 to 2.0
          setCurrentVerticalIndex(2);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 2) {
          // From 2.0 to 3.0
          setCurrentVerticalIndex(3);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 3 && currentHorizontalIndex === 1) {
          // From 3.1 to 4.0
          setCurrentVerticalIndex(4);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 4) {
          // From 4.0 to 5.0
          setCurrentVerticalIndex(5);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 5) {
          // From 5.0 to 0.0
          setCurrentVerticalIndex(0);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex < 5) {
          setCurrentVerticalIndex(currentVerticalIndex + 1);
          setCurrentHorizontalIndex(0); // Reset horizontal index when moving down
        }
        break;

      case 'left':
        if (currentHorizontalIndex > 0) {
          setCurrentHorizontalIndex(currentHorizontalIndex - 1);
        }
        break;

      case 'right':
        if (currentHorizontalIndex < 2 && currentVerticalIndex === 1) {
          setCurrentHorizontalIndex(currentHorizontalIndex + 1);
        } else if (currentHorizontalIndex < 1 && currentVerticalIndex === 3) {
          setCurrentHorizontalIndex(currentHorizontalIndex + 1);
        }
        break;
    }

    // Add a small delay to prevent double navigation
    setTimeout(() => setIsScrolling(false), 850);
  }, [
    isScrolling,
    currentVerticalIndex,
    currentHorizontalIndex,
    setCurrentVerticalIndex,
    setCurrentHorizontalIndex,
    isMenuOpen,
    getCurrentConstraints
  ]);

  // Reset navigation tracking on touch start
  const handleTouchStart = useCallback((e) => {
    console.log('Touch Start Event Fired');
    if (isMenuOpen) {
      console.log('Menu is open, ignoring touch');
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    hasNavigatedThisTouch.current = false;
    movementDirection.current = null;
    lastNavigatedPosition.current = { vertical: currentVerticalIndex, horizontal: currentHorizontalIndex };
    console.log('Touch Start Position:', { x: touchStartX.current, y: touchStartY.current });
  }, [isMenuOpen, currentVerticalIndex, currentHorizontalIndex]);

  const handleTouchMove = useCallback((e) => {
    console.log('Touch Move Event Fired');
    if (isMenuOpen || isScrolling || hasNavigatedThisTouch.current) {
      console.log('Menu open, scrolling, or already navigated - ignoring touch');
      return;
    }
    
    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;
    
    const yDiff = touchStartY.current - touchEndY;
    const xDiff = touchStartX.current - touchEndX;

    console.log('Touch Differences:', { xDiff, yDiff });
    console.log('Current Constraints:', getCurrentConstraints());

    const threshold = 15;

    // Only handle the dominant movement direction
    if (Math.abs(xDiff) > Math.abs(yDiff) * 2) {  // Horizontal movement is clearly dominant
      if (xDiff > threshold && getCurrentConstraints().right) {
        console.log('Moving right');
        e.preventDefault();
        hasNavigatedThisTouch.current = true;
        handleNavigation('right');
      } else if (xDiff < -threshold && getCurrentConstraints().left) {
        console.log('Moving left');
        e.preventDefault();
        hasNavigatedThisTouch.current = true;
        handleNavigation('left');
      }
    } else if (Math.abs(yDiff) > Math.abs(xDiff) * 2) {  // Vertical movement is clearly dominant
      if (yDiff > threshold && getCurrentConstraints().down) {
        console.log('Moving down');
        e.preventDefault();
        hasNavigatedThisTouch.current = true;
        handleNavigation('down');
      } else if (yDiff < -threshold && getCurrentConstraints().up) {
        console.log('Moving up');
        e.preventDefault();
        hasNavigatedThisTouch.current = true;
        handleNavigation('up');
      }
    }
  }, [handleNavigation, getCurrentConstraints, isMenuOpen, isScrolling]);

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
    } else if (currentVerticalIndex === 5) {
      return { x: 300, y: 500 };
    }
    return { x: 0, y: 0 };
  };

  const { x, y } = getViewportPosition();
  const viewportStyle = {
    transform: `translate3d(${-x}vw, ${-y}vh, 0)`
  };

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

    // Add touch event listeners at document level
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleKeyDown, handleMouseWheel, handleTouchStart, handleTouchMove]);

  return (
    <div className={styles.container}>
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
          } else if (vIndex === 5) {
            left = '300vw';
            top = '500vh';
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
     {/*  <ScrollIndicator constraints={getCurrentConstraints()} /> */}
    </div>
  );
};

export default Slider;
