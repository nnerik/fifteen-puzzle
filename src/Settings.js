import React from "react";
import { Paper, IconButton } from "@material-ui/core";
import { Add, Remove } from "@material-ui/icons";

export const SettingsPopper = props => {
  return (
    <Paper>
      <div>
        Rows:{" "}
        <IconButton>
          <Remove />
        </IconButton>
        {props.rows}
        <IconButton>
          <Add />
        </IconButton>
      </div>
      <div>Columns: {props.columns}</div>
    </Paper>
  );
};
