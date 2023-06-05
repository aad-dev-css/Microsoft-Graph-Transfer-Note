import React from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Toolbar, Typography } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Roadmap = () => {
  return (
    <div>
      <Navbar />
      <Container sx={{ width: 1024 }}>
        <Box
          component="main"
          sx={{
            p: 3,
            maxWidth: "100%",
            justifyContent: "center",
          }}
        >
          <Toolbar />
          <Typography>
            <ArrowRightIcon /> Display PG contacts for AAD Dev-supported endpoints.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Roadmap;
