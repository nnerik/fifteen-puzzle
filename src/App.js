import React, { useState } from "react";
import "./App.css";
import {
  newBoard,
  solvedBoard,
  moveTile,
  isSolved,
  getSolution
} from "fifteen-core";
import { Board } from "./Board";
import { Topbar } from "./Topbar";
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

const App = () => {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [board, setBoard] = useState(solvedBoard(width, height));
  const [prevBoard, setPrevBoard] = useState(board);
  const [moves, setMoves] = useState(0);

  const theme = createMuiTheme({
    palette: {
      type: "dark",
      primary: cyan,
      secondary: { main: "#fffacd" }
    },
    typography: {
      fontFamily: ["Russo One", "Sans Serif"]
    }
  });

  const move = id => {
    const updatedBoard = moveTile(board, id);
    setPrevBoard(board);
    setBoard(updatedBoard);
    setMoves(moves + 1);
  };

  const resize = (width, height) => {
    const updatedBoard = solvedBoard(width, height);
    setPrevBoard(updatedBoard);
    setBoard(updatedBoard);
    setMoves(0);
  };

  const shuffle = () => {
    setBoard(newBoard(width, height));
    setPrevBoard(board);
    setMoves(0);
  };

  const solve = () => {
    getSolution(board, width).forEach((id, index) => {
      setTimeout(() => {
        move(id);
      }, 150 * index);
    });
  };

  const solved = isSolved(board, width);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar moves={moves} rows={height} columns={width} resize={resize} />
      <Container className="App">
        <Box m={4}>
          <Typography variant="h2" color="primary">
            Fifteen
          </Typography>
        </Box>
        <Board
          tileSize={100}
          frameWidth={4}
          moves={moves}
          width={width}
          height={height}
          board={board}
          prevBoard={prevBoard}
          handler={move}
          solved={solved}
        />
        <Box m={4}>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={shuffle}
            >
              Shuffle
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={solve}
            >
              Solve
            </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
