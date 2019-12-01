import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Popper,
  Slider
} from "@material-ui/core";
import { Settings } from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  settings: {
    width: 300,

    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper
  }
}));

export const Topbar = props => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
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
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Moves: {props.gameState.moves}
          </Typography>
          <IconButton color="inherit" onClick={handleClick}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <div className={classes.settings}>
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
        </div>
      </Popper>
    </div>
  );
};
