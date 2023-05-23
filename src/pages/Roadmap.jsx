import React from "react";
import Navbar from "../components/Navbar";
import { Box, Container, Toolbar } from "@mui/material";

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
            // backgroundColor: "red",
          }}
        >
          <Toolbar />
          ROADMAP PAGE
        </Box>
      </Container>
    </div>
  );
};

export default Roadmap;
