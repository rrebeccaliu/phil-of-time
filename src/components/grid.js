import React from 'react';
import "./grid.css";

const Grid = ({
  grid,
}) => {
  const cells = new Array(grid.cells).fill(0);
  const rows = new Array(grid.rows).fill(0);

  const handleClick = (e) => {
    const item = e.target;
    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
    } else {
      item.classList.add('selected');
    }
  };
  console.log(cells);

  return (
    <main>
      <h1>Minkowski Space-Time</h1>

      {rows.map((row, index) => (
        <ul className="row" key={index}>
          {cells.map((cell, index) => (
            <li key={index} className="item" onClick={handleClick} />
          ))}
        </ul>
      ))}
    </main>
  );
};

export default Grid;
