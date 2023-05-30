import Testing from "./pages/testing";
import Native from "./pages/native-page";

import { AppBar, Toolbar, Typography } from "@mui/material";

import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <AppBar position="static" sx={{ background: "#004777" }}>
        <Toolbar>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                mr: 3,
                color: "white",
                textDecoration: "none",
                textTransform: "uppercase",
                underline: "none",
                boxShadow: "none",
              }}
            >
              Non-Native Speakers
            </Typography>
          </Link>
          <Link to="/native" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                mr: 1,
                color: "white",
                textDecoration: "none",
                textTransform: "uppercase",
                underline: "none",
                boxShadow: "none",
              }}
            >
              Native Speakers
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Testing />} />
        <Route path="/native" element={<Native />} />
      </Routes>
    </Router>
  );
};

export default App;
