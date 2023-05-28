import Testing from "./pages/testing";

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
                mr: 1,
                color: "white",
                textDecoration: "none",
                textTransform: "uppercase",
                underline: "none",
                boxShadow: "none",
              }}
            >
              Home
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<Testing />} />
      </Routes>
    </Router>
  );
};

export default App;
