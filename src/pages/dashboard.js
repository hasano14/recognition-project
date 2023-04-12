import React from "react";
import { Typography, Container, Paper, Grid, Button } from "@mui/material";

const Dashboard = () => {
  return (
    <Container sx={{ p: 3 }}>
      <Grid container direction="column" spacing={0} alignItems="center">
        <Grid item xs={12} justifyContent="center">
          <Typography variant="h3">Dashboard</Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
