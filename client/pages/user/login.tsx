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
import { login } from "../../action/user";
import MainLayout from "@/layout/MainLayout";
import { useRouter } from "next/router";
import { useActions } from "@/hooks/useActions";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = ({ cookies }: any) => {
  const email = useInput("");
  const password = useInput("");
  const router = useRouter();
  const { setUser, removeUser } = useActions();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handlerLogin = async (email: string, password: string) => {
    const { user, token, error } = await login(email, password);
    if (error) return alert(error.message);
    setUser(user);
    router.push("/");
  };

  return (
    <>
      <MainLayout title={"Registration - music platform"} cookies={cookies}>
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
            style={{ width: "900px", marginBottom: "100px" }}
          >
            <Grid p={3} container alignItems="center" justifyContent="center">
              <Typography variant="h3" color="text.primary" component="h1">
                Login
              </Typography>
            </Grid>

            <Grid className={styles.container} container direction={"column"}>
              <TextField
                {...email}
                className={styles.textfield}
                label={"Your email"}
              />
              {/* <TextField
                {...password}
                className={styles.textfield}
                label={"Enter password"}
              /> */}
              <FormControl variant="outlined" sx={{ marginTop: "20px" }}>
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
                handlerLogin(email.value, password.value);
              }}
            >
              Enter
            </Button>
            <Grid container flexDirection="row" alignItems="center" px={3}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                component="div"
              >
                Don&apos;t have an account?
              </Typography>
              <Button
                className="registration_card_button"
                variant="contained"
                onClick={() => {
                  router.push("/user/registration");
                }}
              >
                Registration
              </Button>
            </Grid>
          </Card>
        </Grid>
      </MainLayout>
    </>
  );
};

export default Login;

export async function getServerSideProps(context: any) {
  const cookies = context.req.headers.cookie || null;
  return {
    props: { cookies },
  };
}
