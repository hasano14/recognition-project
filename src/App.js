import { Chart } from "react-chartjs-2";
import Dashboard from "./pages/dashboard";
import NativePage from "./pages/native-page";
import NonNativePage from "./pages/non-native-page";
import Testing from "./pages/testing";

import { useState } from "react";
// import * as tm from "@tensorflow-models/speech-commands";
// import Sidebar from "./components/dashboard-sidebar";
import {
  AppBar,
  Typography,
  Container,
  Paper,
  Grid,
  Button,
  Box,
  Toolbar,
  IconButton,
} from "@mui/material";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
  Link,
  NavLink,
} from "react-router-dom";
// import { Sidebar } from "./components/dashboard-sidebar";

import { useStateContext } from "./context/ContextProvider";
const items = [
  {
    href: "/",
    title: "Dashboard",
  },
  {
    href: "/native",
    title: "Native English Speaker",
  },
  {
    href: "/nonnative",
    title: "Non-Native English Speaker",
  },
  {
    href: "/testing",
    title: "Testing"
  }
];

const App = () => {
  return (
    <Router>
      <AppBar position="static" sx={{ background: "#004777" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              <Typography variant="button" sx={{ mx: 1, color: "white" }}>
                Home
              </Typography>
            </Link>
            <Link to="/native">
              <Typography variant="button" sx={{ mr: 1, color: "white" }}>
                Native Speakers
              </Typography>
            </Link>
            <Link to="/nonnative">
              <Typography variant="button" sx={{ mr: 1, color: "white" }}>
                Non-Native Speakers
              </Typography>
            </Link>
            <Link to="/testing">
              <Typography variant="button" sx={{ mr: 1, color: "white" }}>
                testing
              </Typography>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/native" element={<NativePage />} />
        <Route path="/nonnative" element={<NonNativePage />} />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </Router>
  );
};

export default App;
