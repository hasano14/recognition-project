import { Chart } from "react-chartjs-2";
import Dashboard from "./pages/dashboard";
import NativePage from "./pages/native-page";
import NonNativePage from "./pages/non-native-page";

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
];

const App = () => {
  const { activeMenu } = useStateContext();
  return (
    <Router>
      {/* {activeMenu ? <Sidebar active={true} /> : <Sidebar active={false} />} */}
      <Container sx={{ pt: 2 }} maxWidth="xl">
        <NavLink to="/">
          <Typography variant="button" sx={{ mr: 1 }}>
            Home
          </Typography>
        </NavLink>
        <NavLink to="/native">
          <Typography variant="button" sx={{ mr: 1 }}>
            Native Speakers
          </Typography>
        </NavLink>
        <NavLink to="/nonnative">
          <Typography variant="button" sx={{ mr: 1 }}>
            Non-Native Speakers
          </Typography>
        </NavLink>
      </Container>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/native" element={<NativePage />} />
        <Route path="/nonnative" element={<NonNativePage />} />
      </Routes>
    </Router>
  );
};

export default App;
