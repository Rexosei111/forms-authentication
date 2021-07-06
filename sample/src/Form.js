import { Typography, Divider, IconButton } from "@material-ui/core";
import { makeStyles, TextField, Button } from "@material-ui/core";
import React, { useState } from "react";
import FacebookIcon from "@material-ui/icons/Facebook";
import CropFreeIcon from "@material-ui/icons/CropFree";
import { InputAdornment } from "@material-ui/core";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { useFormik } from "formik";
import ErrorOutlineOutlinedIcon from "@material-ui/icons/ErrorOutlineOutlined";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios'

const initialValues = {
  Email: "",
  Password: "",
};

const validate = (values) => {
  let errors = {};

  if (!values.Email) {
    errors.Email = "Required Field";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.Email)) {
    errors.Email = "Invalid Email Format";
  }

  if (!values.Password) {
    errors.Password = "Required Field";
  }
  return errors;
};

function Form({ open, handleOpen }) {
  const [ViewPassword, setViewPassword] = useState(false)
  const [token, settoken] = useState("")
  const [status, setstatus] = useState("success")

  const useStyle = makeStyles({
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    div: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },
    divider: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      "& hr": {
        width: "38%",
      },
    },
  });

  const classes = useStyle();

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      let form = new FormData();
      form.append("username", values.Email)
      form.append("password", values.Password)
    
      axios.post("http://localhost:8000/users/login", form)
      .then(res => {
        settoken("Login Was Successful")
        setstatus("success")
      })
      .catch(err => {
        settoken(err.response.data["detail"])
        setstatus("error")
      })
    },
    validate,
  });

  return (
    <>
    {token ? <Alert severity={status}>{token}</Alert> : null}
    <form
      action="#"
      method="POST"
      className={classes.form}
      onSubmit={formik.handleSubmit}
    >
      <div className={classes.div}>
        <TextField
          error={formik.touched.Email && formik.errors.Email ? true : false}
          id="email"
          name="Email"
          type="Email"
          label="Email"
          helperText={formik.touched.Email ? formik.errors.Email : null}
          value={formik.values.Email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="your-email@provider.com"
          autoComplete="current-email"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon />
              </InputAdornment>
            ),
            endAdornment:
              formik.touched.Email && formik.errors.Email ? (
                <InputAdornment position="end">
                  <ErrorOutlineOutlinedIcon color="error" />
                </InputAdornment>
              ) : undefined
          }}
          fullWidth
        />
      </div>

      <div className={classes.div}>
        <TextField
          error={
            formik.touched.Password && formik.errors.Password ? true : false
          }
          id="password"
          label="Password"
          name="Password"
          type={ViewPassword ? "text" : "password"}
          helperText={formik.touched.Password ? formik.errors.Password : null}
          value={formik.values.Password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="password"
          autoComplete="current-password"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOpenIcon />
              </InputAdornment>
            ),
            endAdornment:
              formik.touched.Password && formik.errors.Password ? (
                <InputAdornment position="end">
                  <ErrorOutlineOutlinedIcon color="error" />
                </InputAdornment>
              ) : (
                <InputAdornment position="end">
                  <IconButton onClick={() => setViewPassword(!ViewPassword)}>
                  {ViewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              )   
          }}
          fullWidth
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={formik.errors.Email || formik.errors.Password ? true : false}
      >
        Sign In
      </Button>
      <Typography variant="caption" color="textSecondary" align="center">
        <div className={classes.divider}>
          <Divider />
          <Typography variant="caption" color="textSecondary">
            Continue with
          </Typography>
          <Divider />
        </div>
      </Typography>
      <Button
        variant="outlined"
        startIcon={<FacebookIcon />}
        color="Secondary"
        disableElevation
        component="a"
        href=" https://78fbac969342.ngrok.io/users/login/google"
      >
        Google
      </Button>
      <Button
        variant="outlined"
        startIcon={<CropFreeIcon />}
        color="primary"
        onClick={handleOpen}
      >
        QR Code
      </Button>
    </form>
    </>
  );
}

export default Form;
