import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChevronUp, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const NavigationGrid = styled.div`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 55px 100px 100px 55px;
  grid-template-rows: 55px 20px 55px;
  gap: 10px;
  align-items: center;
  z-index: 1190;
  justify-items: center;
  opacity: ${props => props.$menuOpen ? '0' : '1'};
  pointer-events: ${props => props.$menuOpen ? 'none' : 'auto'};
  transition: opacity 0.3s ease;

  @media (max-width: 500px) {
    bottom: 18px;
    left: 50%;
    grid-template-columns: 55px 70px 70px 55px;
    grid-template-rows: 55px 7px 55px;
    transform: translateX(-50%);
  }
`;

const NavigationButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  backdrop-filter: blur(10px);
  color: white;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }

  @media (max-width: 500px) {
    width: 30px;
    height: 30px;
  }
`;
//color: ${props => props.$isActive ? props.$color : 'white'};
const StyledIcon = styled.div`
  color: ${'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  
  @media (max-width: 500px) {
    font-size: 17px;
  }
`;

const CenterSpace = styled.div`
  width: 100%;
  height: 100%;
  grid-column: 2/span 2;
  grid-row: 2;
  @media (max-width: 500px) {
    width: 20px;
    height: 20px;
  }
`;

const DiamondIndicator = ({ 
  currentVerticalIndex, 
  currentHorizontalIndex, 
  isMenuOpen,
  getSlideColor,
  onNavigate
}) => {
  const getCurrentConstraints = () => {
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
    const key = `${currentVerticalIndex}.${currentHorizontalIndex}`;
    return navigationConstraints[key] || { up: false, down: false, left: false, right: false };
  };

  const getNextSlideColor = (direction) => {
    switch(direction) {
      case 'up':
        if (currentVerticalIndex === 1 && currentHorizontalIndex === 0) return getSlideColor(0, 0);
        if (currentVerticalIndex === 2) return getSlideColor(1, 2);
        if (currentVerticalIndex === 3 && currentHorizontalIndex === 0) return getSlideColor(2, 0);
        if (currentVerticalIndex === 4) return getSlideColor(3, 1);
        if (currentVerticalIndex === 0) return getSlideColor(5, 0);
        return getSlideColor(currentVerticalIndex - 1, 0);
      case 'down':
        if (currentVerticalIndex === 0) return getSlideColor(1, 0);
        if (currentVerticalIndex === 1 && currentHorizontalIndex === 2) return getSlideColor(2, 0);
        if (currentVerticalIndex === 2) return getSlideColor(3, 0);
        if (currentVerticalIndex === 3 && currentHorizontalIndex === 1) return getSlideColor(4, 0);
        if (currentVerticalIndex === 5) return getSlideColor(0, 0);
        return getSlideColor(currentVerticalIndex + 1, 0);
      case 'left':
        return getSlideColor(currentVerticalIndex, currentHorizontalIndex - 1);
      case 'right':
        return getSlideColor(currentVerticalIndex, currentHorizontalIndex + 1);
      default:
        return '#000';
    }
  };

  const handleClick = (direction) => {
    const constraints = getCurrentConstraints();
    if (!constraints[direction]) return;
    onNavigate(direction);
  };

  const constraints = getCurrentConstraints();

  return (
    <NavigationGrid $menuOpen={isMenuOpen}>
      {/* Top button */}
      <div style={{ gridColumn: 2, gridRow: 3,justifySelf: 'flex-end' }}>
        <NavigationButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('up')}
          disabled={!constraints.up}
        >
          <StyledIcon 
            $isActive={constraints.up}
            $color={constraints.up ? getNextSlideColor('up') : 'white'}
          >
            <FaChevronUp />
          </StyledIcon>
        </NavigationButton>
      </div>

      {/* Left button */}
      <div style={{ gridColumn: 1, gridRow: 2 }}>
        <NavigationButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('left')}
          disabled={!constraints.left}
        >
          <StyledIcon 
            $isActive={constraints.left}
            $color={constraints.left ? getNextSlideColor('left') : 'white'}
          >
            <FaChevronLeft />
          </StyledIcon>
        </NavigationButton>
      </div>

      {/* Center space for breadcrumbs */}
      <CenterSpace />

      {/* Right button */}
      <div style={{ gridColumn: 4, gridRow: 2 }}>
        <NavigationButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('right')}
          disabled={!constraints.right}
        >
          <StyledIcon 
            $isActive={constraints.right}
            $color={constraints.right ? getNextSlideColor('right') : 'white'}
          >
            <FaChevronRight />
          </StyledIcon>
        </NavigationButton>
      </div>

      {/* Bottom button */}
      <div style={{ gridColumn: 3, gridRow: 3, justifySelf: 'flex-start' }}>
        <NavigationButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleClick('down')}
          disabled={!constraints.down}
        >
          <StyledIcon 
            $isActive={constraints.down}
            $color={constraints.down ? getNextSlideColor('down') : 'white'}
          >
            <FaChevronDown />
          </StyledIcon>
        </NavigationButton>
      </div>
    </NavigationGrid>
  );
};

export default DiamondIndicator;
