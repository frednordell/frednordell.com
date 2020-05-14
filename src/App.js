//@flow

import React from "react";

//Material UI things
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import grey from "@material-ui/core/colors/grey";
import deepOrange from "@material-ui/core/colors/deepOrange";

//App wide css
import "./App.css";

//components
import Intro from "./components/intro/intro";
import TopBar from "./components/topbar/topbar";

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: deepOrange,
    type: "dark",
  },
});

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Intro />
    </MuiThemeProvider>
  );
}

export default App;
