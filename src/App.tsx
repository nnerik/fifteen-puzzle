import "./App.css";
import { Board } from "./components/Board";
import { Topbar } from "./components/Topbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  CssBaseline,
  Box,
  Button,
  ButtonGroup,
  Container,
  Typography,
} from "@mui/material";
import { cyan } from "@mui/material/colors";
import "@fontsource/russo-one";
import { usePuzzleGame } from "./game/usePuzzleGame";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: cyan[500],
      contrastText: "#000",
    },
    background: {
      default: "#303030",
    },
    secondary: { main: "#fffacd" },
  },
  typography: {
    fontFamily: ['"Russo One"', "sans-serif"].join(","),
  },
});

/** Main Fifteen Puzzle application shell and game controller. */
const App = () => {
  const { gameState, isReplaying, move, resize, shuffle, solve } =
    usePuzzleGame();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Topbar disabled={isReplaying} gameState={gameState} resize={resize} />
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
          isDisabled={isReplaying}
          onMove={move}
        />
        <Box sx={{ m: 4 }}>
          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              disabled={isReplaying}
              size="large"
              onClick={shuffle}
            >
              Shuffle
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={isReplaying}
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
