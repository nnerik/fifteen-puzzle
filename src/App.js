import React from "react";
import "./App.css";
import { newBoard, solvedBoard, moveTile, isSolved } from "./fifteen";
import { Board } from "./Board";

class App extends React.Component {
  initWidth = 4;
  initHeight = 4;
  initBoard = solvedBoard(this.initWidth, this.initHeight);
  state = {
    width: this.initWidth,
    height: this.initHeight,
    board: this.initBoard,
    prevBoard: this.initBoard,
    moves: 0
  };

  move = id => {
    const updatedBoard = moveTile(this.state.board, this.state.width, id);
    if (updatedBoard) {
      this.setState({
        prevBoard: this.state.board,
        board: updatedBoard,
        moves: this.state.moves + 1
      });
    }
  };

  shuffle = id => {
    const board = newBoard(this.state.width, this.state.height);
    this.setState({
      board: board,
      prevBoard: board,
      moves: 0
    });
  };

  render() {
    const solved = isSolved(this.state.board);
    return (
      <div className="App">
        <header className="App-header">
          <h1>Fifteen</h1>
          <Board
            tileSize={100}
            frameWidth={4}
            moves={this.moves}
            width={this.state.width}
            height={this.state.height}
            board={this.state.board}
            prevBoard={this.state.prevBoard}
            handler={this.move}
            solved={solved}
          />
          <p>
            Moves: {this.state.moves === 0 && solved ? "" : this.state.moves}
          </p>
          <a className="App-link" onClick={this.shuffle}>
            Shuffle
          </a>
        </header>
      </div>
    );
  }
}

export default App;
