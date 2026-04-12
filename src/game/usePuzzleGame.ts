import { useCallback, useEffect, useRef, useState } from "react";
import {
  createGameState,
  createShuffledBoard,
  createSolvedBoard,
  isMovable,
  moveTile,
  type GameState,
} from "./puzzle";
import { getSolution } from "./solver";

const replayDelayMs = 150;

const solutionReducer = (acc: GameState[], tile: number) => {
  const prev = acc[acc.length - 1];

  if (prev === undefined) {
    return acc;
  }

  return acc.concat({
    previousBoard: prev.board,
    board: moveTile(prev.board, tile),
    moves: prev.moves + 1,
  });
};

/** Owns puzzle state transitions and solve replay scheduling. */
export const usePuzzleGame = () => {
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(),
  );
  const [isReplaying, setIsReplaying] = useState(false);
  const replayTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearReplayTimers = useCallback(() => {
    replayTimeouts.current.forEach((timeoutId) => clearTimeout(timeoutId));
    replayTimeouts.current = [];
  }, []);

  const clearReplay = useCallback(() => {
    clearReplayTimers();
    setIsReplaying(false);
  }, [clearReplayTimers]);

  useEffect(() => clearReplayTimers, [clearReplayTimers]);

  const resize = useCallback(
    (width: number, height: number) => {
      clearReplay();
      const board = createSolvedBoard(width, height);
      setGameState({ board, previousBoard: board, moves: 0 });
    },
    [clearReplay],
  );

  const move = useCallback(
    (tile: number) => {
      clearReplay();
      setGameState((current) => {
        if (!isMovable(current.board, tile)) {
          return current;
        }

        return {
          previousBoard: current.board,
          board: moveTile(current.board, tile),
          moves: current.moves + 1,
        };
      });
    },
    [clearReplay],
  );

  const shuffle = useCallback(() => {
    clearReplay();
    setGameState((current) => {
      const shuffledBoard = createShuffledBoard(
        current.board.width,
        current.board.height,
      );

      return {
        previousBoard: shuffledBoard,
        board: shuffledBoard,
        moves: 0,
      };
    });
  }, [clearReplay]);

  const solve = useCallback(() => {
    clearReplay();

    const solution = getSolution(gameState.board);

    if (solution.status === "already-solved") {
      return;
    }

    if (solution.status === "limit-reached") {
      alert("No solution found!");
      return;
    }

    setIsReplaying(true);
    const replayStates = solution.moves
      .reduce(solutionReducer, [gameState])
      .slice(1);

    replayTimeouts.current = replayStates.map((state, index) =>
      setTimeout(
        () => {
          setGameState(state);

          if (index === replayStates.length - 1) {
            replayTimeouts.current = [];
            setIsReplaying(false);
          }
        },
        replayDelayMs * (index + 1),
      ),
    );
  }, [clearReplay, gameState]);

  return {
    gameState,
    isReplaying,
    move,
    resize,
    shuffle,
    solve,
  };
};
