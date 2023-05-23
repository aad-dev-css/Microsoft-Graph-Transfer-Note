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
            <ArrowRightIcon /> Allow v1.0 and beta.
          </Typography>
          <Typography>
            <ArrowRightIcon />
            Allow other methods further than GET.
          </Typography>
          <Typography>
            <ArrowRightIcon />
            Allow to pass a body on the request.
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Roadmap;
