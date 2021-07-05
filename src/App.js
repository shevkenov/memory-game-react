import "./App.css";
import Board from "./components/Board";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Play the flip card game</h1>
        <h3>
          Select two cards with same content consequetivly to make them vanish
        </h3>
      </header>
      <Board />
    </div>
  );
}

export default App;
