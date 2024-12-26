import React, { useEffect, useState } from 'react';
import styles from './Grid.module.css';

const Grid = () => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    const calculateCellSize = () => {
      // Get the smallest viewport dimension
      const minViewportSize = Math.min(window.innerWidth, window.innerHeight);
      // Divide by desired number of cells (e.g., 8 for an 8x8 grid)
      const newCellSize = Math.floor(minViewportSize / 24);
      setCellSize(newCellSize);
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, []);

  // Create an 8x8 grid
  const cells = Array(5000).fill(null);

  return (
    <div className={styles.gridContainer} style={{ '--cell-size': `${cellSize}px` }}>
      {cells.map((_, index) => (
        <div key={index} className={styles.cell} />
      ))}
    </div>
  );
};

export default Grid;
