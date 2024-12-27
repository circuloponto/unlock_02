import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from './components/Slider';
import ProgressBar from './components/ProgressBar';
import DiamondIndicator from './components/DiamondIndicator';
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
  z-index: 2001;
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
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.2);
  }
`;

const SlideSection = styled.section`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.$bgColor || '#000'};
  transition: background-color 0.5s ease;
`;

const getSlideColor = (vIndex, hIndex) => {
  switch(vIndex) {
    case 0: return '#75b1e1';
    case 1:
      switch(hIndex) {
        case 0: return '#daa77a';
        case 1: return '#EEB559';
        case 2: return '#E5BF81';
        default: return '#E4815D';
      }
    case 2: return '#B48A6C';
    case 3:
      switch(hIndex) {
        case 0: return '#254b76';
        case 1: return '#0d3563';
        default: return '#4A90E2';
      }
    case 4:
      switch(hIndex) {
        case 0: return '#98525b';
        default: return '#4A90E2';
      }
    case 5:
      return '#2B3548';
    default: return '#576581';
  }
};

const getBreadcrumbColor = (vIndex, hIndex) => {
  switch(vIndex) {
    case 0: return '#75b1e1';
    case 1:
      switch(hIndex) {
        case 0: return '#daa77a';
        case 1: return '#D99B31';
        case 2: return '#C9A45C';
        default: return '#D15B35';
      }
    case 2: return '#96714F';
    case 3:
      switch(hIndex) {
        case 0: return '#2B74C9';
        case 1: return '#4B89D6';
        default: return '#2B74C9';
      }
    case 4:
      switch(hIndex) {
        case 0: return '#95525b';
        default: return '#2B74C9';
      }
    case 5:
      return '#1A2130';
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
    content: <SlideSection $bgColor={getSlideColor(4, 0)}>{/* Slide 5 */}</SlideSection>
  },
  { 
    content: <SlideSection $bgColor={getSlideColor(5, 0)}>{/* Slide 6 */}</SlideSection>
  }
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
    const currentSlide = slides[currentVerticalIndex];
    if (!currentSlide) return getSlideColor(0, 0); // Fallback color
    
    if (currentSlide.horizontal) {
      return getSlideColor(currentVerticalIndex, currentHorizontalIndex);
    } else {
      return getSlideColor(currentVerticalIndex, 0);
    }
  };

  const handleIndicatorNavigation = (direction) => {
    switch(direction) {
      case 'up':
        if (currentVerticalIndex === 0) {
          // From first slide to last
          setCurrentVerticalIndex(5);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 1 && currentHorizontalIndex === 0) {
          setCurrentVerticalIndex(0);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 2) {
          setCurrentVerticalIndex(1);
          setCurrentHorizontalIndex(2);
        } else if (currentVerticalIndex === 3 && currentHorizontalIndex === 0) {
          setCurrentVerticalIndex(2);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 4) {
          setCurrentVerticalIndex(3);
          setCurrentHorizontalIndex(1);
        } else if (currentVerticalIndex === 5) {
          setCurrentVerticalIndex(4);
          setCurrentHorizontalIndex(0);
        }
        break;
      case 'down':
        if (currentVerticalIndex === 5) {
          // From last slide to first
          setCurrentVerticalIndex(0);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 0) {
          setCurrentVerticalIndex(1);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 1 && currentHorizontalIndex === 2) {
          setCurrentVerticalIndex(2);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 2) {
          setCurrentVerticalIndex(3);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 3 && currentHorizontalIndex === 1) {
          setCurrentVerticalIndex(4);
          setCurrentHorizontalIndex(0);
        } else if (currentVerticalIndex === 4) {
          setCurrentVerticalIndex(5);
          setCurrentHorizontalIndex(0);
        }
        break;
      case 'left':
        if (currentHorizontalIndex > 0) {
          setCurrentHorizontalIndex(currentHorizontalIndex - 1);
        }
        break;
      case 'right':
        if ((currentVerticalIndex === 1 && currentHorizontalIndex < 2) ||
            (currentVerticalIndex === 3 && currentHorizontalIndex < 1)) {
          setCurrentHorizontalIndex(currentHorizontalIndex + 1);
        }
        break;
    }
  };

  useEffect(() => {
    // Don't modify body overflow as it might interfere with touch events
    return () => {
      document.body.style.overflow = 'unset';
    };
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
      
      <Grid />

      <Content>
        <Slider
          slides={slides}
          currentVerticalIndex={currentVerticalIndex}
          setCurrentVerticalIndex={setCurrentVerticalIndex}
          currentHorizontalIndex={currentHorizontalIndex}
          setCurrentHorizontalIndex={setCurrentHorizontalIndex}
          isMenuOpen={isMenuOpen}
        />
      </Content>

      <DiamondIndicator 
        onNavigate={handleIndicatorNavigation}
        isMenuOpen={isMenuOpen}
        currentVerticalIndex={currentVerticalIndex}
        currentHorizontalIndex={currentHorizontalIndex}
        getSlideColor={getSlideColor}
      />

      <BreadcrumbsNav className="breadcrumbs-custom" $menuOpen={isMenuOpen}>
        {slides.map((slide, vIndex) => (
          slide.horizontal ? (
            <HorizontalBreadcrumbs key={vIndex}
           >
              {slide.horizontal.map((_, hIndex) => (
                <BreadcrumbButton
                  key={`${vIndex}-${hIndex}`}
                  onClick={() => handleBreadcrumbClick(vIndex, hIndex)}
                  style={{
                    borderColor:currentVerticalIndex === vIndex && currentHorizontalIndex === hIndex
                    ?'rgb(230, 129, 29)' : 'white',
                    background: currentVerticalIndex === vIndex && currentHorizontalIndex === hIndex
                  ? 'rgb(230, 129, 29)'
                  : 'transparent',
                  boxShadow: currentVerticalIndex === vIndex && currentHorizontalIndex === hIndex
                  ? `0px 0px 0px 2px rgba(255, 255, 255, 0.6)`
                  : 'none'
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
                borderColor: currentVerticalIndex === vIndex ? 'rgb(230, 129, 29)' : 'white',
                background: currentVerticalIndex === vIndex
                  ? 'rgb(230, 129, 29)'
                  : 'transparent',
                  boxShadow: currentVerticalIndex === vIndex
                  ? `0px 0px 0px 2px rgba(255, 255, 255, 0.6)`
                  : 'none'
              }}
            />
          )
        ))}
      </BreadcrumbsNav>
    </AppContainer>
  );
}

export default App;
