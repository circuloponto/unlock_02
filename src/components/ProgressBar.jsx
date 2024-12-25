import React from 'react';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Progress = styled.div`
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  transition: width 0.3s ease;
`;

const ProgressBar = ({ slides, currentVerticalIndex, currentHorizontalIndex }) => {
  const calculateProgress = () => {
    const totalSlides = slides.reduce((acc, slide) => {
      return acc + (slide.horizontal ? slide.horizontal.length : 1);
    }, 0);

    let currentProgress = slides.slice(0, currentVerticalIndex).reduce((acc, slide) => {
      return acc + (slide.horizontal ? slide.horizontal.length : 1);
    }, 0);

    if (slides[currentVerticalIndex]?.horizontal) {
      currentProgress += currentHorizontalIndex;
    }

    return Math.max(0, (currentProgress / (totalSlides - 1)) * 100);
  };

  return (
    <ProgressBarContainer>
      <Progress style={{ width: `${calculateProgress()}%` }} />
    </ProgressBarContainer>
  );
};

export default ProgressBar;
