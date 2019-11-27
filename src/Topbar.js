import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import { Settings } from "@material-ui/icons/";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  }
}));

export const Topbar = props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Moves: {props.moves}
          </Typography>
          <IconButton color="inherit" onClick={props.toggleSettings}>
            <Settings />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};
