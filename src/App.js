import React, { useState } from "react";
import "./App.css";
import { newBoard, solvedBoard, moveTile, getSolution } from "./fifteen";
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
  const [gameState, setGameState] = useState({
    board: solvedBoard(3, 3),
    prevBoard: solvedBoard(3, 3),
    moves: 0
  });

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

  const resize = (width, height) => {
    const newBoard = solvedBoard(width, height);
    setGameState({ board: newBoard, prevBoard: newBoard, moves: 0 });
  };

  const move = id => {
    setGameState({
      prevBoard: gameState.board,
      board: moveTile(gameState.board, id),
      moves: gameState.moves + 1
    });
  };

  const shuffle = () => {
    const shuffledBoard = newBoard(
      gameState.board.width,
      gameState.board.height
    );
    setGameState({
      prevBoard: shuffledBoard,
      board: shuffledBoard,
      moves: 0
    });
  };

  const solve = () => {
    getSolution(gameState.board).forEach((id, index) => {
      setTimeout(() => {
        move(id);
      }, 150 * index);
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar gameState={gameState} resize={resize} />
      <Container className="App">
        <Box m={4}>
          <Typography variant="h2" color="primary">
            Fifteen
          </Typography>
        </Box>
        <Board
          tileSize={100}
          frameWidth={4}
          gameState={gameState}
          handler={move}
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
