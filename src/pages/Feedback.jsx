import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  Box,
  Button,
  Container,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const Feedback = () => {
  const [feedback, setFeedback] = useState({ title: "", description: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedback((feedback) => ({
      ...feedback,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    console.log("I was clicked!");
  };

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
            backgroundColor: "red",
          }}
        >
          <Toolbar />

          <UnauthenticatedTemplate>
            <p>Sign In to submit feedback!</p>
          </UnauthenticatedTemplate>

          <AuthenticatedTemplate>
            <Box component="form">
              <Typography sx={{ display: "flex", justifyContent: "center" }}>
                Submit your Feedback using the form below:
              </Typography>
              <TextField
                name="title"
                value={feedback.title}
                onChange={(event) => handleChange(event)}
                placeholder="Title"
                fullWidth
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <TextField
                name="description"
                value={feedback.description}
                onChange={(event) => handleChange(event)}
                placeholder="Description"
                multiline
                rows={6}
                fullWidth
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <Button variant="contained">Submit</Button>
            </Box>
          </AuthenticatedTemplate>
        </Box>
      </Container>
    </div>
  );
};

export default Feedback;
