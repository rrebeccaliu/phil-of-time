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
          strokeWidth="2"
        />
      );
    });
  };

  console.log(selectedCells);

  const renderLightCone = () => {
    if (selectedCells.length === 0) return null;

    const lastCell = selectedCells[selectedCells.length - 1];
    const x = lastCell.x * 9 + 4.5;
    const y = lastCell.y * 9 + 4.5;
    const width = grid.cells * 9;
    const height = grid.rows * 9;

    return (
      <>
        {/* Upper triangle (light cone) */}
        <polygon
          points={`${x},${y} ${Math.min(0, x-y)},${Math.min(0, y-x)} 0,0 ${width},0 ${Math.min(x+y, width)},${Math.max(0, x+y-height)}`}
          fill="rgba(255, 100, 0, 0.5)"
        />
        {/* Lower triangle (light cone) */}
        <polygon
          points={`${x},${y} ${Math.max(0, x+y-width)},${Math.min(x+y, height)} 0,${height} ${width},${height} ${Math.min(width, width+x-y)},${Math.min(height, height+y-x)}`}
          fill="rgba(255, 100, 0, 0.5)"
        />
      </>
    );
  };

  return (
    <main>
      <h1>Minkowski Space-Time</h1>
      <div className="content-container">
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
            {renderLightCone()}
            {renderLines()}
          </svg>
        </div>
        <div className="info-container">
          <h2>Selected Points</h2>
          <ul>
            {selectedCells.map((cell, index) => (
              <li key={index}>Point {index + 1}: ({cell.x}, {cell.y})</li>
            ))}
          </ul>
          <h2>Lines</h2>
          <ul>
            {selectedCells.slice(1).map((cell, index) => (
              <li key={index}>
                Line {index + 1}: ({selectedCells[index].x}, {selectedCells[index].y}) to ({cell.x}, {cell.y})
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Grid;
