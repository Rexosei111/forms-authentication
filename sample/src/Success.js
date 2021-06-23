import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

function Success({Response}) {
  return (
    <Alert severity="success">
      <AlertTitle>File Sent Successfully</AlertTitle>
      <Typography variant="subtitle1">Details: </Typography>
      <ul>
          <li>{Response.fileName}</li>
          <li>{Response["Content-Type"]}</li>
          <li>{Response.file_size}</li>
          <li>{Response.path}</li>
      </ul>
    </Alert>
  );
}

export default Success;
