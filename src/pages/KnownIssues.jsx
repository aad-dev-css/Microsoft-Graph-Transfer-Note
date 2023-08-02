import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Container, Toolbar, Typography } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const KnownIssues = () => {
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
            <ArrowRightIcon /> Certain endpoints, such as Unfollow site (POST https://graph.microsoft.com/v1.0/users/user-id/followedSites/remove), require real values in its URL to return its TargetWorkloadId, otherwise it will return a error. In this application, a "Invalid MS Graph API endpoint." message will be returned for these type of endpoints. If a documented MS Graph API endpoint returns a "Invalid MS Graph API endpoint." message in this application, please provide feedback with the endpoint used so that our team can track these edge cases.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default KnownIssues;
