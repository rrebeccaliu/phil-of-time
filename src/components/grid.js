import React, { useState, useRef } from 'react';
import './grid.css';

const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#A833FF',
  '#33FFF2', '#FFD633', '#FF8333', '#33FF83', '#FF3333',
  '#3333FF', '#33A8FF', '#A8FF33', '#FFA833', '#FF5733',
  '#5733FF', '#33FF57', '#FF33F2', '#FF5733', '#33FFF2'
];

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const calculateElapsedTime = (x1, y1, x2, y2) => {
  return Math.sqrt(((y2 - y1) ** 2) - ((x2 - x1) ** 2));
};

const Grid = ({ grid }) => {
  const [selectedCells, setSelectedCells] = useState([{ points: [], color: getRandomColor() }]);
  const [pointCount, setPointCount] = useState(0);
  const [draggingPoint, setDraggingPoint] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const holdTimeout = useRef(null);
  const holdDuration = 1000;

  const getCellCoordinates = (e) => {
    const rect = e.target.closest('svg').getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 9);
    const y = Math.floor((e.clientY - rect.top) / 9);
    return { x, y };
  };

  const handleMouseDown = (e, rowIndex, cellIndex) => {
    e.preventDefault();
    console.log(`Mouse down on cell (${cellIndex}, ${rowIndex})`);

    const existingPoint = selectedCells.flatMap(list => list.points).find(point => point.x === cellIndex && point.y === rowIndex);
    if (existingPoint) {
      console.log(`Clicked on existing point (${existingPoint.x}, ${existingPoint.y})`);
      setDraggingPoint(existingPoint);
      setIsDragging(true);
      console.log('Dragging point set to:', existingPoint);
    } else {
      holdTimeout.current = setTimeout(() => {
        console.log(`Hold and click on cell (${cellIndex}, ${rowIndex})`);
        setIsDragging(false); // Reset dragging state after hold
        // Implement any additional logic for hold and click here
      }, holdDuration);
    }
  };

  const handleMouseUp = (e) => {
    clearTimeout(holdTimeout.current);

    const { x: cellIndex, y: rowIndex } = getCellCoordinates(e);
    console.log(`Mouse up on cell (${cellIndex}, ${rowIndex})`);

    if (isDragging && draggingPoint) {
      console.log('Dragging is true');
      console.log('Dragging point:', draggingPoint);
      setSelectedCells(prevSelectedCells => {
        const newSelectedCells = [...prevSelectedCells];
        const listContainingPointIndex = newSelectedCells.findIndex(list =>
          list.points.some(point => point.x === draggingPoint.x && point.y === draggingPoint.y)
        );
        console.log('List containing point index:', listContainingPointIndex); // Added console log
        if (listContainingPointIndex !== -1) {
          const pointIndex = newSelectedCells[listContainingPointIndex].points.findIndex(point => point.x === draggingPoint.x && point.y === draggingPoint.y);
          newSelectedCells[listContainingPointIndex].points[pointIndex] = { ...draggingPoint, x: cellIndex, y: rowIndex };
          console.log(`Moved point to (${cellIndex}, ${rowIndex})`);
        }

        // Log all points
        const allPoints = newSelectedCells.flatMap(list => list.points);
        console.log('All points:', allPoints);

        return newSelectedCells;
      });

      setDraggingPoint(null);
      setIsDragging(false);
    } else {
      handleClick(e, rowIndex, cellIndex);
    }
  };

  const handleMouseLeave = () => {
    clearTimeout(holdTimeout.current);
    console.log('Mouse left the cell');
  };

  const handleClick = (e, rowIndex, cellIndex) => {
    e.stopPropagation();
    console.log(`handleClick called for cell (${cellIndex}, ${rowIndex})`);

    const isShiftPressed = e.shiftKey;
    let alertTriggered = false;
    setSelectedCells(prevSelectedCells => {
      const newSelectedCells = [...prevSelectedCells];
      let newPointCount = pointCount;

      if (!isShiftPressed && newSelectedCells.length > 0 && newSelectedCells[newSelectedCells.length - 1].points.length > 0) {
        const lastList = newSelectedCells[newSelectedCells.length - 1].points;
        const lastPoint = lastList[lastList.length - 1];

        const deltaX = Math.abs(cellIndex - lastPoint.x);
        const deltaY = Math.abs(rowIndex - lastPoint.y);
        if (deltaX > deltaY || lastPoint.y < rowIndex) {
          if (!alertTriggered) {
            alert('You cannot reach that point.');
            alertTriggered = true;
          }
          return prevSelectedCells;
        }
      }

      const newPoint = { x: cellIndex, y: rowIndex, label: newPointCount + 1 };

      if (isShiftPressed) {
        newSelectedCells.push({ points: [newPoint], color: getRandomColor() });
        newPointCount += 1;
      } else {
        const lastList = newSelectedCells[newSelectedCells.length - 1].points;
        newPointCount += 1;
        if (!lastList.some(point => point.x === cellIndex && point.y === rowIndex)) {
          lastList.push(newPoint);
        }
      }

      setPointCount(newPointCount);

      // Log all points
      const allPoints = newSelectedCells.flatMap(list => list.points);
      console.log('All points:', allPoints);

      return newSelectedCells;
    });
  };

  const handleMouseMove = (e) => {
    if (draggingPoint !== null && isDragging) {
      console.log('Mouse move event', e);
      console.log('Dragging point:', draggingPoint);
      const { x: cellIndex, y: rowIndex } = getCellCoordinates(e);

      setSelectedCells(prevSelectedCells => {
        const newSelectedCells = [...prevSelectedCells];
        const listContainingPointIndex = newSelectedCells.findIndex(list => list.points.includes(draggingPoint));
        console.log('List containing point index:', listContainingPointIndex); // Added console log
        if (listContainingPointIndex !== -1) {
          const pointIndex = newSelectedCells[listContainingPointIndex].points.indexOf(draggingPoint);
          newSelectedCells[listContainingPointIndex].points[pointIndex] = { ...draggingPoint, x: cellIndex, y: rowIndex };
        }

        // Log all points
        const allPoints = newSelectedCells.flatMap(list => list.points);
        console.log('All points:', allPoints);

        return newSelectedCells;
      });
    }
  };

  const handleDelete = (labelToDelete) => {
    setSelectedCells(prevSelectedCells => {
      let newSelectedCells = prevSelectedCells.map(list => ({
        ...list,
        points: list.points.filter(point => point.label !== labelToDelete)
      })).filter(list => list.points.length > 0);

      if (newSelectedCells.length === 0) {
        newSelectedCells = [{ points: [], color: getRandomColor() }];
      }

      // Log all points
      const allPoints = newSelectedCells.flatMap(list => list.points);
      console.log('All points:', allPoints);

      return newSelectedCells;
    });
  };

  const renderLines = () => {
    return selectedCells.flatMap((list, listIndex) =>
      list.points.slice(1).map((cell, index) => {
        const prevCell = list.points[index];
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
              stroke={list.color}
              strokeWidth="2"
            />
          </g>
        );
      })
    );
  };

  const renderPoints = () => {
    return selectedCells.flatMap((list, listIndex) =>
      list.points.map((cell, index) => {
        const x = cell.x * 9 + 4.5;
        const y = cell.y * 9 + 4.5;
        return (
          <text
            key={`${listIndex}-${index}`}
            x={x + 5}
            y={y - 5}
            fill={list.color}
            onMouseDown={(e) => handleMouseDown(e, cell.y, cell.x)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            style={{ cursor: 'pointer' }}
          >
            {cell.label}
          </text>
        );
      })
    );
  };

  const renderLightCone = () => {
    const lastList = selectedCells[selectedCells.length - 1].points;
    if (lastList.length === 0) return null;

    const lastCell = lastList[lastList.length - 1];
    const x = lastCell.x * 9 + 4.5;
    const y = lastCell.y * 9 + 4.5;
    const width = grid.cells * 9;
    const height = grid.rows * 9;

    return (
      <>
        <polygon
          points={`${x},${y} ${Math.min(0, x-y)},${Math.min(0, y-x)} 0,0 ${width},0 ${Math.min(x+y, width)},${Math.max(0, x+y-height)}`}
          fill="rgba(255, 100, 0, 0.5)"
        />
        <polygon
          points={`${x},${y} ${Math.max(0, x+y-width)},${Math.min(x+y, height)} 0,${height} ${width},${height} ${Math.min(width, width+x-y)},${Math.min(height, height+y-x)}`}
          fill="rgba(255, 100, 0, 0.5)"
        />
      </>
    );
  };

  const getCellColor = (cellIndex, rowIndex) => {
    for (const list of selectedCells) {
      if (list.points.some(point => point.x === cellIndex && point.y === rowIndex)) {
        return list.color;
      }
    }
    return 'rgb(156, 153, 202)';
  };

  const calculateGroupElapsedTime = (points) => {
    let totalElapsedTime = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const { x: x1, y: y1 } = points[i];
      const { x: x2, y: y2 } = points[i + 1];
      totalElapsedTime += calculateElapsedTime(x1, y1, x2, y2);
    }
    return totalElapsedTime;
  };

  return (
    <main>
      <h1>Minkowski Space-Time</h1>
      <div className="content-container">
        <div className="grid-container">
          <svg className="grid-svg" style={{ width: grid.cells * 9, height: grid.rows * 9 }}
               onMouseMove={handleMouseMove}
               onMouseUp={handleMouseUp}>
            {Array.from({ length: grid.rows }).map((_, rowIndex) => (
              <g className="row" key={rowIndex}>
                {Array.from({ length: grid.cells }).map((_, cellIndex) => {
                  const cellColor = getCellColor(cellIndex, rowIndex);
                  return (
                    <rect
                      key={cellIndex}
                      className="cell"
                      x={cellIndex * 9}
                      y={rowIndex * 9}
                      width="8"
                      height="8"
                      onMouseDown={(e) => handleMouseDown(e, rowIndex, cellIndex)}
                      onMouseLeave={handleMouseLeave}
                      style={{ fill: cellColor }}
                    />
                  );
                })}
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
              {selectedCells.flatMap(list => list.points).map((cell, cellIndex) => (
                <li key={cellIndex}>
                  Point {cell.label}: ({cell.x}, {cell.y}){' '}
                  <button onClick={() => handleDelete(cell.label)} style={{ color: selectedCells.find(list => list.points.includes(cell)).color }}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="lines-container">
            <h2>Lines and Speeds</h2>
            {selectedCells.map((list, listIndex) => (
              <div key={listIndex}>
                <ul>
                  {list.points.slice(1).map((cell, index) => {
                    const prevCell = list.points[index];
                    const deltaY = cell.y - prevCell.y;
                    const deltaX = cell.x - prevCell.x;
                    const speed = Math.abs((deltaX / deltaY).toFixed(2));
                    return (
                      <li key={`${listIndex}-${index}`}>
                        Line {index + 1}: ({list.points[index].x}, {list.points[index].y}) to ({cell.x}, {cell.y}) - Speed: {speed} c
                      </li>
                    );
                  })}
                </ul>
                <p>Elapsed Time: {calculateGroupElapsedTime(list.points)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Grid;
