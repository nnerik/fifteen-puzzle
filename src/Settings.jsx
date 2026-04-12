import React from "react";
import { Paper, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

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
