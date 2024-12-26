import React, { useEffect, useState } from 'react';
import styles from './Grid.module.css';

const TOTAL_COLUMNS = 24;

const Grid = () => {
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    const calculateCellSize = () => {
      // Use exact division for precise cell sizes
      const newCellSize = window.innerWidth / TOTAL_COLUMNS;
      setCellSize(newCellSize);
    };

    calculateCellSize();
    window.addEventListener('resize', calculateCellSize);
    return () => window.removeEventListener('resize', calculateCellSize);
  }, []);

  const cells = Array(TOTAL_COLUMNS * 150).fill(null);

  return (
    <div 
      className={styles.gridContainer} 
      style={{ '--cell-size': `${cellSize}px` }}
    >
      {cells.map((_, index) => (
        <div key={index} className={styles.cell} />
      ))}
    </div>
  );
};

export default Grid;
