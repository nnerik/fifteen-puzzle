import React from "react";
import "./App.css";
import { newBoard } from "./game.js";
import { Board } from "./Board";

class App extends React.Component {
  state = {
    width: 4,
    height: 4,
    board: newBoard(4, 4)
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Fifteen</h1>
          <Board
            width={this.state.width}
            height={this.state.height}
            board={this.state.board}
          />
        </header>
      </div>
    );
  }
}

export default App;
