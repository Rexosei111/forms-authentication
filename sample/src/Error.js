import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

function Error() {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      Unable to send File — <strong>This may be due to: </strong>
      <Typography variant="ul">
          <li>Network Issues</li>
          <li>Invalid File Type</li>
          <li>Refresh the page</li>
      </Typography>
    </Alert>
  );
}

export default Error;
