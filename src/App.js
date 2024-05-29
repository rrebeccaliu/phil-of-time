import "./App.css";
import Grid from "./components/grid";

export default function App() {
  const grid = {
    cells: 75,
    rows: 75
  };

  return (
    <div className="app">
      <Grid
        grid={grid}
      />
    </div>
  );
}
