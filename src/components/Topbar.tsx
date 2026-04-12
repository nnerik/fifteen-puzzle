import { useState } from "react";
import type { MouseEvent } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Popper,
  Slider,
  ClickAwayListener,
} from "@mui/material";
import type { SliderProps } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import type { GameState } from "../game/puzzle";

type TopbarProps = {
  disabled?: boolean;
  gameState: GameState;
  resize: (width: number, height: number) => void;
};

/** Normalizes Material UI slider values to a single number. */
const sliderValue = (
  value: Parameters<NonNullable<SliderProps["onChange"]>>[1],
): number => (Array.isArray(value) ? (value[0] ?? 0) : value);

/** Renders game controls for move count and board dimensions. */
export const Topbar = (props: TopbarProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const handleRows: SliderProps["onChange"] = (_, value) => {
    props.resize(props.gameState.board.width, sliderValue(value));
  };

  const handleColumns: SliderProps["onChange"] = (_, value) => {
    props.resize(sliderValue(value), props.gameState.board.height);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings" : undefined;

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Moves: {props.gameState.moves}
            </Typography>
            <IconButton
              aria-controls={id}
              aria-expanded={open}
              color="inherit"
              disabled={props.disabled}
              onClick={handleClick}
              aria-label="settings"
            >
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Popper id={id} open={open} anchorEl={anchorEl}>
          <Box
            sx={(theme) => ({
              width: 300,
              border: "1px solid",
              p: 1,
              bgcolor: theme.palette.background.paper,
            })}
          >
            <Typography id="rows-slider" gutterBottom>
              Rows
            </Typography>
            <Slider
              value={props.gameState.board.height}
              onChange={handleRows}
              aria-labelledby="rows-slider"
              disabled={props.disabled}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={2}
              max={6}
            />
            <Typography id="columns-slider" gutterBottom>
              Columns
            </Typography>
            <Slider
              value={props.gameState.board.width}
              onChange={handleColumns}
              aria-labelledby="columns-slider"
              disabled={props.disabled}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={2}
              max={6}
            />
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
};
