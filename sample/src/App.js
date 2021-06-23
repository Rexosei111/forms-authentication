import React, {useState} from "react";
import {
  AppBar,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Paper,
} from "@material-ui/core";
import {
  ThemeProvider,
  createMuiTheme,
  makeStyles,
} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { CssBaseline } from "@material-ui/core";
import Form from "./Form";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import Qrcode from "./Qrcode";
import useMediaQuery from '@material-ui/core/useMediaQuery';



function App() {
  const matches = useMediaQuery('(max-width: 600px)');

  const useStyle = makeStyles((theme) => ({
    container: {
      height: "90vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      width: matches ? "100%" : "70%",
      padding: theme.spacing(2.5, 2),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
    },
  }));

 
  const darkTheme = createMuiTheme({
    palette: {
      type: "light",
    },
  });

  const classes = useStyle();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <AppBar position="sticky" elevation={0}>
          <Toolbar variant="dense">
            <IconButton edge="start" arial-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="h1">
              React Forms
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="sm" className={classes.container}>
          <Paper className={classes.paper} elevation={0}>
            <DonutLargeIcon fontSize="large" />
            <Typography variant="h5">Login Form</Typography>
            <Form open={open} handleOpen={handleOpen}/>
          </Paper>
        </Container>
        <Qrcode open={open} handleClose={handleClose}/>
      </ThemeProvider>
    </>
  );
}

export default App;
