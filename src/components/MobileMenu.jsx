import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import styled from 'styled-components';

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: ${props => props.$slideColor ? `color-mix(in srgb, ${props.$slideColor} 100%, black 0%)` : '#000'};
  z-index: 1200;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
`;

const MenuScroll = styled.div`
  position: relative;
  height: 100%;
  padding: 120px 10% 120px;
  color: #fff;
  z-index: 1;
`;

const MenuContent = styled.div`
  position: absolute;
  top: 120px;
  left: 10%;
  right: 10%;
  z-index: 2;
`;

const MenuItem = styled.div`
  position: relative;
  font-size: 92px;
  line-height: 0.95;
  padding: 8px 0;
  cursor: pointer;
  transform: translateX(${props => props.$isOpen ? '0' : '100vw'});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: ${props => props.$delay}s;
  text-transform: lowercase;
  z-index: 3;
  pointer-events: auto;
  color: #fff;
  
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 72px;
  }
  @media (max-width: 433px) {
    font-size: 40px;
  }
`;

const MenuInfo = styled.div`
  position: relative;
  margin-top: 80px;
  font-size: 16px;
  opacity: 0.6;
  transform: translateX(${props => props.$isOpen ? '0' : '100vw'});
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: 0.7s;
  max-width: 400px;
  z-index: 2;
  color: #fff;
`;

const menuItems = [
  { label: 'about', delay: 0.4, verticalIndex: 0, horizontalIndex: 0 },
  { label: 'objectives', delay: 0.45, verticalIndex: 1, horizontalIndex: 0 },
  { label: 'stakeholders', delay: 0.5, verticalIndex: 2, horizontalIndex: 0 },
  { label: 'field reports', delay: 0.55, verticalIndex: 3, horizontalIndex: 0 }
];

const MobileMenu = ({ isOpen, onClose, setCurrentVerticalIndex, setCurrentHorizontalIndex, slideColor }) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.children[0],
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isOpen]);

  const handleMenuItemClick = (verticalIndex, horizontalIndex) => {
    console.log('Menu item clicked:', { verticalIndex, horizontalIndex });
    // First update the indices
    setCurrentVerticalIndex(verticalIndex);
    setCurrentHorizontalIndex(horizontalIndex);
    // Then close the menu after a small delay to allow the state updates
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <MenuContainer $isOpen={isOpen} $slideColor={slideColor}>
      <div ref={scrollRef} style={{ height: '100%' }}>
        <MenuScroll>
          <MenuContent>
            {menuItems.map((item) => (
              <MenuItem
                key={item.label}
                $isOpen={isOpen}
                $delay={item.delay}
                $slideColor={slideColor}
                onClick={() => handleMenuItemClick(item.verticalIndex, item.horizontalIndex)}
              >
                {item.label}
              </MenuItem>
            ))}
            <MenuInfo $isOpen={isOpen}>
              <p> 2024 UNLOCK</p>
              <p style={{ marginTop: '20px' }}>
                A project funded by the European Union's Horizon Europe research and innovation programme under grant agreement No 101057344
              </p>
            </MenuInfo>
          </MenuContent>
        </MenuScroll>
      </div>
    </MenuContainer>
  );
};

export default MobileMenu;
