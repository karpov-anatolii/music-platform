import "../styles/globals.scss";

import React, { FC } from "react";
import { AppProps } from "next/app";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    palette: {
      mode: string;
    };
  }
}
const theme = createTheme({
  direction: "ltr",
  palette: {
    mode: "dark",
    primary: {
      // light: will be calculated from palette.primary.main,
      // main: indigo[500], // "#ff5500",
      main: "#4d0cff", // "#ff5500",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: "#0066ff",
      main: "#fc0dd4",
      // dark: will be calculated from palette.secondary.main,
      // contrastText: "#ffcc00",
    },
  },
});
const { wrapper } = require("../store/store");

export function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default wrapper.withRedux(App);
