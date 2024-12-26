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
    grid-template-columns: 55px 175px 55px;
    grid-template-rows: 55px 20px 55px;
    gap: 10px;
    align-items: center;
    z-index: 1190;
    justify-items: center;
   

  @media (max-width: 500px) {
    bottom: 18px;
    left: 50%; /* Centered */
    grid-template-columns: 55px 130px 55px;
    grid-template-rows: 55px 7px 55px;
    transform: translateX(-50%); /* Ensure it's centered when scaled */
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
// dont remove this line color: ${props => props.$isActive ? props.$color : 'white'};
const StyledIcon = styled.div`
  color:white;
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
  grid-column: 2;
  grid-row: 2;
  @media (max-width: 500px) {
   width: 20px;
  height: 20px;
  }
`;

const DiamondIndicator = ({ 
  currentVerticalIndex, 
  currentHorizontalIndex, 
  slides,
  isMenuOpen,
  getSlideColor,
  onNavigate
}) => {
  const getCurrentConstraints = () => {
    const navigationConstraints = {
      "0.0": { up: false, down: true, left: false, right: false },
      "1.0": { up: true, down: false, left: false, right: true },
      "1.1": { up: false, down: false, left: true, right: true },
      "1.2": { up: false, down: true, left: true, right: false },
      "2.0": { up: true, down: true, left: false, right: false },
      "3.0": { up: true, down: false, left: false, right: true },
      "3.1": { up: false, down: true, left: true, right: false },
      "4.0": { up: true, down: false, left: false, right: false },
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
        return getSlideColor(currentVerticalIndex - 1, 0);
      case 'down':
        if (currentVerticalIndex === 0) return getSlideColor(1, 0);
        if (currentVerticalIndex === 1 && currentHorizontalIndex === 2) return getSlideColor(2, 0);
        if (currentVerticalIndex === 2) return getSlideColor(3, 0);
        if (currentVerticalIndex === 3 && currentHorizontalIndex === 1) return getSlideColor(4, 0);
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
    if (!constraints[direction]) return;
    onNavigate(direction);
  };

  const constraints = getCurrentConstraints();

  return (
    <NavigationGrid>
      {/* Top button */}
      <div style={{ gridColumn: 2, gridRow: 1 }}>
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
      <div style={{ gridColumn: 3, gridRow: 2 }}>
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
      <div style={{ gridColumn: 2, gridRow: 3 }}>
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
