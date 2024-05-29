import React, { useState } from 'react';
import './grid.css';

const Grid = ({ grid }) => {
  const [selectedCells, setSelectedCells] = useState([]);

  const handleClick = (e, rowIndex, cellIndex) => {
    setSelectedCells([...selectedCells, { x: cellIndex, y: rowIndex }]);
  };

  const renderLines = () => {
    return selectedCells.slice(1).map((cell, index) => {
      const prevCell = selectedCells[index];
      const x1 = prevCell.x * 9 + 4.5;  // Centering the line in the cell
      const y1 = prevCell.y * 9 + 4.5;
      const x2 = cell.x * 9 + 4.5;
      const y2 = cell.y * 9 + 4.5;
      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="red"
          strokeWidth="1"
        />
      );
    });
  };

  return (
    <main>
      <h1>Minkowski Space-Time</h1>
      <div className="grid-container">
        <svg className="grid-svg" style={{ width: grid.cells * 9, height: grid.rows * 9 }}>
          {/* Background rectangle */}
          <rect
            x="0"
            y="0"
            width={grid.cells * 9}
            height={grid.rows * 9}
            fill="black"
          />
          {Array.from({ length: grid.rows }).map((_, rowIndex) => (
            <g className="row" key={rowIndex}>
              {Array.from({ length: grid.cells }).map((_, cellIndex) => (
                <rect
                  key={cellIndex}
                  className={`cell ${selectedCells.some(cell => cell.x === cellIndex && cell.y === rowIndex) ? 'selected' : ''}`}
                  x={cellIndex * 9}
                  y={rowIndex * 9}
                  width="8"
                  height="8"
                  onClick={(e) => handleClick(e, rowIndex, cellIndex)}
                />
              ))}
            </g>
          ))}
          {renderLines()}
        </svg>
      </div>
    </main>
  );
};

export default Grid;
