import React, { useState } from 'react';
import './grid.css';

const Grid = ({ grid }) => {
  const [selectedCells, setSelectedCells] = useState([[]]);
  const [pointCount, setPointCount] = useState(0); // State variable to keep track of total points

  const handleClick = (e, rowIndex, cellIndex) => {
    const isShiftPressed = e.shiftKey;
    const newPoint = { x: cellIndex, y: rowIndex, label: pointCount + 1 };

    setSelectedCells(prevSelectedCells => {
      const newSelectedCells = [...prevSelectedCells];

      if (!isShiftPressed && newSelectedCells.length > 0 && newSelectedCells[newSelectedCells.length - 1].length > 0) {
        const lastList = newSelectedCells[newSelectedCells.length - 1];
        const lastPoint = lastList[lastList.length - 1];
        
        // Check if the point is outside the light cone
        const deltaX = Math.abs(cellIndex - lastPoint.x);
        const deltaY = Math.abs(rowIndex - lastPoint.y);
        if (deltaX > deltaY) {
          alert('You cannot reach that point.');
          return prevSelectedCells; // Do not add the point
        }
      }

      if (isShiftPressed) {
        newSelectedCells.push([newPoint]);
      } else {
        const lastList = newSelectedCells[newSelectedCells.length - 1];
        if (!lastList.some(point => point.x === cellIndex && point.y === rowIndex)) {
          lastList.push(newPoint);
        }
      }

      setPointCount(prevCount => prevCount + 1); // Increment the point count
      return newSelectedCells;
    });
  };

  const handleDelete = (labelToDelete) => {
    setSelectedCells(prevSelectedCells => {
      let newSelectedCells = prevSelectedCells.map(list => list.filter(point => point.label !== labelToDelete)).filter(list => list.length > 0);

      // Ensure at least one empty list is present to allow new points to be added
      if (newSelectedCells.length === 0) {
        newSelectedCells = [[]];
      }

      return newSelectedCells;
    });
  };

  const renderLines = () => {
    return selectedCells.flatMap((list, listIndex) =>
      list.slice(1).map((cell, index) => {
        const prevCell = list[index];
        const x1 = prevCell.x * 9 + 4.5;
        const y1 = prevCell.y * 9 + 4.5;
        const x2 = cell.x * 9 + 4.5;
        const y2 = cell.y * 9 + 4.5;

        return (
          <g key={`${listIndex}-${index}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="red"
              strokeWidth="2"
            />
          </g>
        );
      })
    );
  };

  const renderPoints = () => {
    return selectedCells.flatMap((list, listIndex) =>
      list.map((cell, index) => {
        const x = cell.x * 9 + 4.5;
        const y = cell.y * 9 + 4.5;
        return (
          <text key={`${listIndex}-${index}`} x={x + 5} y={y - 5} fill="black">
            {cell.label}
          </text>
        );
      })
    );
  };

  const renderLightCone = () => {
    const lastList = selectedCells[selectedCells.length - 1];
    if (lastList.length === 0) return null;

    const lastCell = lastList[lastList.length - 1];
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
                    className={`cell ${selectedCells.flat().some(cell => cell.x === cellIndex && cell.y === rowIndex) ? 'selected' : ''}`}
                    x={cellIndex * 9}
                    y={rowIndex * 9}
                    width="8"
                    height="8"
                    onClick={(e) => handleClick(e, rowIndex, cellIndex)}
                  />
                ))}
              </g>
            ))}
          </svg>
          <svg className="overlay-svg" style={{ width: grid.cells * 9, height: grid.rows * 9 }}>
            {renderLightCone()}
            {renderLines()}
            {renderPoints()}
          </svg>
        </div>
        <div className="info-container">
          <div className="points-container">
            <h2>Selected Points</h2>
            <ul>
              {selectedCells.flat().map((cell, cellIndex) => (
                <li key={cellIndex}>
                  Point {cell.label}: ({cell.x}, {cell.y}){' '}
                  <button onClick={() => handleDelete(cell.label)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="lines-container">
            <h2>Lines and Speeds</h2>
            {selectedCells.map((list, listIndex) => (
              <ul key={listIndex}>
                {list.slice(1).map((cell, index) => {
                  const prevCell = list[index];
                  const deltaY = cell.y - prevCell.y;
                  const deltaX = cell.x - prevCell.x;
                  const speed = (deltaX / deltaY).toFixed(2);
                  return (
                    <li key={`${listIndex}-${index}`}>
                      Line {index + 1}: ({list[index].x}, {list[index].y}) to ({cell.x}, {cell.y}) - Speed: {speed} c
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Grid;
