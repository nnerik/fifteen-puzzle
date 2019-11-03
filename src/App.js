import React from "react";
import "./App.css";
import { newBoard, movePiece } from "./fifteen";
import { Board } from "./Board";

class App extends React.Component {
  state = {
    width: 4,
    height: 4,
    board: newBoard(4, 4)
  };

  move = id => {
    console.log(`Clicked piece ${id}.`);
    this.setState({
      board: movePiece(
        this.state.board,
        this.state.width,
        this.state.height,
        id
      )
    });
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
            handler={this.move}
          />
        </header>
      </div>
    );
  }
}

export default App;
