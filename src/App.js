import React from "react";
import "./App.css";
import { newBoard, movePiece } from "./fifteen";
import { Board } from "./Board";

class App extends React.Component {
  board = newBoard(4, 4);
  state = {
    width: 4,
    height: 4,
    board: this.board,
    prevBoard: this.board
  };

  move = id => {
    this.setState({
      prevBoard: this.state.board,
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
            prevBoard={this.state.prevBoard}
            handler={this.move}
          />
        </header>
      </div>
    );
  }
}

export default App;
