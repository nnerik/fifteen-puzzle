import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Popper,
  Slider,
  ClickAwayListener
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export const Topbar = props => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAway = () => {
    setAnchorEl(null);
  };

  const handleRows = (_, value) => {
    props.resize(props.gameState.board.width, value);
  };

  const handleColumns = (_, value) => {
    props.resize(value, props.gameState.board.height);
  };

  const open = Boolean(anchorEl);
  const id = open ? "settings" : undefined;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Moves: {props.gameState.moves}
          </Typography>
          <ClickAwayListener onClickAway={handleClickAway}>
            <IconButton color="inherit" onClick={handleClick} aria-label="settings">
              <SettingsIcon />
            </IconButton>
          </ClickAwayListener>
        </Toolbar>
      </AppBar>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box
          sx={theme => ({
            width: 300,
            border: "1px solid",
            p: 1,
            bgcolor: theme.palette.background.paper
          })}
        >
          <Typography gutterBottom>Rows</Typography>
          <Slider
            value={props.gameState.board.height}
            onChange={handleRows}
            aria-labelledby="rows-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={6}
          />
          <Typography gutterBottom>Columns</Typography>
          <Slider
            value={props.gameState.board.width}
            onChange={handleColumns}
            aria-labelledby="columns-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={2}
            max={6}
          />
        </Box>
      </Popper>
    </Box>
  );
};
