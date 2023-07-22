import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import useInput from "@/hooks/useInput";
import styles from "../../styles/Create.module.scss";
import MainLayout from "@/layout/MainLayout";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";
import { IUser } from "@/store/user/user.types";
import { useRegistrationMutation } from "@/store/user/userApi";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Registration = () => {
  const name = useInput("");
  const email = useInput("");
  const password = useInput("");
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const { setUser } = useActions();
  const [registration, mutationResult] = useRegistrationMutation();
  const handlerRegistration = async (
    name: string,
    email: string,
    password: string
  ) => {
    registration({ name, email, password })
      .unwrap()
      .then((data) => {
        if (data.error) return alert(data.error.message);
        setUser(data.user);
        router.push("/");
      })
      .catch((rejected) => console.error(rejected));
  };

  return (
    <>
      <MainLayout title={"Registration - music platform"}>
        <Button
          color="secondary"
          variant="contained"
          style={{ margin: "0 0 20px" }}
          onClick={() => router.push(`/`)}
        >
          Back to Main
        </Button>
        <Grid container justifyContent="center">
          <Card
            className="card_transparent registration_card"
            style={{ width: "900px", marginBottom: "30px" }}
          >
            <Grid p={3} container alignItems="center" justifyContent="center">
              <Typography variant="h3" color="text.primary" component="h1">
                Registration
              </Typography>
            </Grid>

            <Grid className={styles.container} container direction={"column"}>
              <TextField
                {...name}
                className={styles.textfield}
                label={"Your name"}
              />
              <TextField
                {...email}
                className={styles.textfield}
                label={"Your email"}
              />
              <FormControl
                variant="outlined"
                sx={{ marginTop: "20px" }}
                className={styles.textfield}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  {...password}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </Grid>

            <Button
              className="registration_card_button"
              variant="contained"
              onClick={() => {
                handlerRegistration(name.value, email.value, password.value);
              }}
            >
              Enter
            </Button>
          </Card>
        </Grid>
      </MainLayout>
    </>
  );
};

export default Registration;
