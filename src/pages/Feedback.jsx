import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Container,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { loginRequestAPI } from "../authConfig";
import { submitFeedback } from "../graph";
import CloseIcon from "@mui/icons-material/Close";

const Feedback = () => {
  const [feedback, setFeedback] = useState({ title: "", description: "" });
  const { instance, accounts } = useMsal();
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedback((feedback) => ({
      ...feedback,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      const authResponse = await instance.acquireTokenSilent({
        ...loginRequestAPI,
        account: accounts[0],
      });
      const apiResponse = await submitFeedback(
        authResponse.accessToken,
        feedback
      );
      console.log(apiResponse);
      if (apiResponse) {
        setOpen(true);
        setFeedback({ title: "", description: "" });
      }
    } catch (error) {
      console.log(error);
    }
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
            // backgroundColor: "red",
          }}
        >
          <Toolbar />

          <UnauthenticatedTemplate>
            <Typography
              variant="h5"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Sign In to submit feedback!
            </Typography>
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
              <Button variant="contained" onClick={onSubmit}>
                Submit
              </Button>
            </Box>
            <Collapse in={open}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ marginTop: 10 }}
              >
                Feedback submitted successfully!
              </Alert>
            </Collapse>
          </AuthenticatedTemplate>
        </Box>
      </Container>
    </div>
  );
};

export default Feedback;
