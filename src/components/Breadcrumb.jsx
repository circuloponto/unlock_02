import React from 'react';
import './Breadcrumb.css';

const Breadcrumb = ({ slides, currentVerticalIndex, currentHorizontalIndex, onNavigate }) => {
  return (
    <nav className="nav">
      {slides.map((slide, index) => (
        <div key={index} className="slideIndicator">
          {!slide.horizontal ? (
            <button
              className={`mainDot ${currentVerticalIndex === index ? 'active' : ''}`}
              onClick={() => onNavigate(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ) : (
            <div className="horizontalIndicators">
              {slide.horizontal.map((_, hIndex) => (
                <div
                  key={hIndex}
                  className={`subDot ${currentVerticalIndex === index && currentHorizontalIndex === hIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
