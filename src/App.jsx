import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from './components/Slider';
import ProgressBar from './components/ProgressBar';
import Navbar from './components/Navbar';
import Grid from './components/Grid';
import './App.css';

const AppContainer = styled.div`
  width: 100vw;
  height: 300vh;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  overflow-y: visible;
`;

const Content = styled.div`
  height: 300vh;
  width: 100%;
`;

const BreadcrumbsNav = styled.nav`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  gap: 10px;
  z-index: 1000;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  opacity: ${props => props.$menuOpen ? '0' : '1'};
  pointer-events: ${props => props.$menuOpen ? 'none' : 'auto'};
  transition: opacity 0s ease;
`;

const HorizontalBreadcrumbs = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const BreadcrumbButton = styled.button`
  width: ${props => props.$isMain ? '16px' : '12px'};
  height: ${props => props.$isMain ? '16px' : '12px'};
  border-radius: 50%;
  border: 2px solid;
  padding: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }

  &.active {
    transform: scale(1.2);
  }
`;

const SlideSection = styled.section`
  background-color: ${props => props.$bgColor};
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const ProgressBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;



const getSlideColor = (vIndex, hIndex) => {
  switch(vIndex) {
    case 0: return '#CBBEB3';
    case 1:
      switch(hIndex) {
        case 0: return '#e6821e80';
        case 1: return '#EEB559';
        case 2: return '#E5BF81';
        default: return '#E4815D';
      }
    case 2: return '#B48A6C';
    case 3:
      switch(hIndex) {
        case 0: return '#285a95c2';
        case 1: return '#0e3d74c2';
        default: return '#4A90E2';
      }
    case 4:
      switch(hIndex) {
        case 0: return '#98525b';
        default: return '#4A90E2';
      }
    default: return '#576581';
  }
};

const getBreadcrumbColor = (vIndex, hIndex) => {
  switch(vIndex) {
    case 0: return '#3A4358';  // Darker version of #576581
    case 1:
      switch(hIndex) {
        case 0: return '#CBBEB3';  // Darker version of #E4815D
        case 1: return '#D99B31';  // Darker version of #EEB559
        case 2: return '#C9A45C';  // Darker version of #E5BF81
        default: return '#D15B35';
      }
    case 2: return '#96714F';  // Darker version of #B48A6C
    case 3:
      switch(hIndex) {
        case 0: return '#2B74C9';  // Darker version of #4A90E2
        case 1: return '#4B89D6';  // Darker version of #7EB3F1
        default: return '#2B74C9';
      }
    case 4:
      switch(hIndex) {
        case 0: return '#95525b';  // Darker version of #4A90E2
       
        default: return '#2B74C9';
      }
    default: return '#3A4358';
  }
};

const slides = [
  { 
    content: <SlideSection $bgColor={getSlideColor(0, 0)}>{/* Slide 1 */}</SlideSection>
  },
  {
    horizontal: [
      <SlideSection $bgColor={getSlideColor(1, 0)}>{/* Slide 2.1 */}</SlideSection>,
      <SlideSection $bgColor={getSlideColor(1, 1)}>{/* Slide 2.2 */}</SlideSection>,
      <SlideSection $bgColor={getSlideColor(1, 2)}>{/* Slide 2.3 */}</SlideSection>,
    ],
  },
  { 
    content: <SlideSection $bgColor={getSlideColor(2, 0)}>{/* Slide 3 */}</SlideSection>
  },
  {
    horizontal: [
      <SlideSection $bgColor={getSlideColor(3, 0)}>{/* Slide 4.1 */}</SlideSection>,
      <SlideSection $bgColor={getSlideColor(3, 1)}>{/* Slide 4.2 */}</SlideSection>,
    ],
  },
  { 
    content: <SlideSection $bgColor={getSlideColor(4, 0)}>{/* Slide 3 */}</SlideSection>
  },
];

function App() {
  const [currentVerticalIndex, setCurrentVerticalIndex] = useState(0);
  const [currentHorizontalIndex, setCurrentHorizontalIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = (value) => {
    if (typeof value === 'function') {
      setIsMenuOpen(value);
    } else {
      setIsMenuOpen(value);
    }
  };

  const handleBreadcrumbClick = (vIndex, hIndex) => {
    setCurrentVerticalIndex(vIndex);
    setCurrentHorizontalIndex(hIndex);
  };

  const getActiveBorderColor = () => {
    return getBreadcrumbColor(currentVerticalIndex, currentHorizontalIndex);
  };

  const getCurrentSlideColor = () => {
    if (slides[currentVerticalIndex].horizontal) {
      return getSlideColor(currentVerticalIndex, currentHorizontalIndex);
    } else {
      return getSlideColor(currentVerticalIndex, 0);
    }
  };

  useEffect(() => {
    isMenuOpen && (document.body.style.overflow = 'hidden');
    !isMenuOpen && (document.body.style.overflow = 'unset');
  }, [isMenuOpen]);

  return (
    <AppContainer>
      <Navbar 
        currentSlide={currentVerticalIndex} 
        slideColor={getCurrentSlideColor()}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
        setCurrentVerticalIndex={setCurrentVerticalIndex}
        setCurrentHorizontalIndex={setCurrentHorizontalIndex}
      />
      <ProgressBarContainer />
      <ProgressBar
        slides={slides}
        currentVerticalIndex={currentVerticalIndex}
        currentHorizontalIndex={currentHorizontalIndex}
      />
      <Grid />
      <Slider
        slides={slides}
        currentVerticalIndex={currentVerticalIndex}
        setCurrentVerticalIndex={setCurrentVerticalIndex}
        currentHorizontalIndex={currentHorizontalIndex}
        setCurrentHorizontalIndex={setCurrentHorizontalIndex}
        isMenuOpen={isMenuOpen}
      />
      <Content />
      <BreadcrumbsNav className="breadcrumbs-custom" $menuOpen={isMenuOpen}>
        {slides.map((slide, vIndex) => (
          slide.horizontal ? (
            <HorizontalBreadcrumbs key={vIndex}>
              {slide.horizontal.map((_, hIndex) => (
                <BreadcrumbButton
                  key={`${vIndex}-${hIndex}`}
                  onClick={() => handleBreadcrumbClick(vIndex, hIndex)}
                  style={{
                    borderColor: currentVerticalIndex === vIndex && currentHorizontalIndex === hIndex
                      ? getActiveBorderColor()
                      : '#fff',
                    background: currentVerticalIndex === vIndex && currentHorizontalIndex === hIndex
                      ? getActiveBorderColor()
                      : 'transparent'
                  }}
                />
              ))}
            </HorizontalBreadcrumbs>
          ) : (
            <BreadcrumbButton
              key={vIndex}
              $isMain
              onClick={() => handleBreadcrumbClick(vIndex, 0)}
              style={{
                borderColor: currentVerticalIndex === vIndex
                  ? getActiveBorderColor()
                  : '#fff',
                background: currentVerticalIndex === vIndex
                  ? getActiveBorderColor()
                  : 'transparent'
              }}
            />
          )
        ))}
      </BreadcrumbsNav>
    </AppContainer>
  );
}

export default App;
