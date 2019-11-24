import React from "react";
import "./App.css";
import {
  newBoard,
  solvedBoard,
  moveTile,
  isSolved,
  getSolution
} from "fifteen-core";
import { Board } from "./Board";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  CssBaseline,
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography
} from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";
import "typeface-russo-one";

class App extends React.Component {
  initWidth = 3;
  initHeight = 3;
  initBoard = solvedBoard(this.initWidth, this.initHeight);
  state = {
    width: this.initWidth,
    height: this.initHeight,
    board: this.initBoard,
    prevBoard: this.initBoard,
    moves: 0
  };

  theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: cyan
    },
    typography: {
      fontFamily: ["Russo One", "Sans Serif"]
    }
  });

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
      <ThemeProvider theme={this.theme}>
        <CssBaseline />
        <Container className="App">
          <Box m={4}>
            <Typography variant="h2" color="primary">
              15 Fifteen
            </Typography>
          </Box>
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
          <Box m={1}>
            <Typography variant="h5" color="primary">
              Moves: {this.state.moves === 0 && solved ? "" : this.state.moves}
            </Typography>
          </Box>
          <Box m={4}>
            <ButtonGroup>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.shuffle}
              >
                Shuffle
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={this.solve}
              >
                Solve
              </Button>
            </ButtonGroup>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
