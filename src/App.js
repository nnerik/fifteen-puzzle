import React from "react";
import "./App.css";
import {
  newBoard,
  solvedBoard,
  moveTile,
  isSolved,
  getSolution
} from "./fifteen";
import { Board } from "./Board";

class App extends React.Component {
  initWidth = 3;
  initHeight = 2;
  initBoard = solvedBoard(this.initWidth, this.initHeight);
  state = {
    width: this.initWidth,
    height: this.initHeight,
    board: this.initBoard,
    prevBoard: this.initBoard,
    moves: 0
  };

  move = id => {
    const updatedBoard = moveTile(this.state.board, id);
    this.setState({
      prevBoard: this.state.board,
      board: updatedBoard,
      moves: this.state.moves + 1
    });
  };

  shuffle = id => {
    const board = newBoard(this.state.width, this.state.height);
    this.setState({
      board: board,
      prevBoard: board,
      moves: 0
    });
  };

  solve = () => {
    getSolution(this.state.board, this.state.width).forEach((id, index) => {
      setTimeout(() => {
        this.move(id);
      }, 150 * index);
    });
  };

  render() {
    const solved = isSolved(this.state.board, this.state.width);
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
          <p>
            <button className="App-button" onClick={this.shuffle}>
              Shuffle
            </button>
            <button className="App-button" onClick={this.solve}>
              Solve
            </button>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
