import { useMemo, useState } from "react";
import "./App.css";
import {
  createGameState,
  createShuffledBoard,
  createSolvedBoard,
  moveTile,
  type GameState
} from "./game/puzzle";
import { getSolution } from "./game/solver";
import { Board } from "./components/Board";
import { Topbar } from "./components/Topbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import "@fontsource/russo-one";

const App = () => {
  const [gameState, setGameState] = useState<GameState>(() => createGameState());

  const theme = useMemo(() => createTheme({
    palette: {
      mode: "dark",
      primary: cyan,
      secondary: { main: "#fffacd" }
    },
    typography: {
      fontFamily: ['"Russo One"', "sans-serif"].join(",")
    }
  }), []);

  const resize = (width: number, height: number) => {
    const board = createSolvedBoard(width, height);
    setGameState({ board, previousBoard: board, moves: 0 });
  };

  const move = (tile: number) => {
    setGameState({
      previousBoard: gameState.board,
      board: moveTile(gameState.board, tile),
      moves: gameState.moves + 1
    });
  };

  const shuffle = () => {
    const shuffledBoard = createShuffledBoard(
      gameState.board.width,
      gameState.board.height
    );
    setGameState({
      previousBoard: shuffledBoard,
      board: shuffledBoard,
      moves: 0
    });
  };

  const solutionReducer = (acc: GameState[], tile: number) => {
    const prev = acc[acc.length - 1];

    if (prev === undefined) {
      return acc;
    }

    return acc.concat({
      previousBoard: prev.board,
      board: moveTile(prev.board, tile),
      moves: prev.moves + 1
    });
  };

  const solve = () => {
    const solution = getSolution(gameState.board);
    if (solution.length === 0) alert("No solution found!");
    else
      solution.reduce(solutionReducer, [gameState]).forEach((state, index) => {
        setTimeout(() => setGameState(state), 150 * index);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar gameState={gameState} resize={resize} />
      <Container className="App">
        <Box sx={{ m: 4 }}>
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
        <Box sx={{ m: 4 }}>
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
