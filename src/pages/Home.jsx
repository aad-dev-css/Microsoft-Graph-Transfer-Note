import React, { useState } from "react";
import "../styles/App.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequestGraph } from "../authConfig";
import { loginRequestAPI } from "../authConfig";
import { callMsGraph } from "../graph";
import { callAPI } from "../graph";
import { Note } from "../components/Note";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Toolbar,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem
} from "@mui/material";

const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [apiOutput, setApiOutput] = useState(null);
  const [endpoint, setEndpoint] = useState("");
  const [endpointOutput, setEndpointOutput] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");

  const handleChange = (event) => {
    setEndpoint(event.target.value);
  };

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const onButtonClick = () => {
    RequestWhatIf(endpoint,method,body);
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  function RequestWhatIf(endpoint,method,body) {
    setEndpointOutput(endpoint);
    setMethod(method)
    // Silently acquires an access token which is then attached to a request for MS Graph data
    console.log("method: " + method)
    instance
      .acquireTokenSilent({
        ...loginRequestGraph,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken, endpoint, method, body).then((response) => {
          if (response.TargetWorkloadId !== undefined) {
            RequestAPI(response,method);
          } else {
            const invalidObj = {
              TargetWorkloadId: "Null",
              Team: "Null",
              Routing: "Null",
            };
            var isBadRequest = false;
            if (response.error.message === "Unable to read JSON request payload. Please ensure Content-Type header is set and payload is of valid JSON format.") isBadRequest = true;
            setResult(invalidObj,isBadRequest);
          }
        });
      });
  }

  function setResult(payload,isBadRequest) {
    var newMessage = "";
    if (payload.TargetWorkloadId === "Null") {
      if(isBadRequest){
        newMessage =
        "Bad request (Unable to read JSON request payload). Please validate or fill request body.";
      }else{
        newMessage =
        "Invalid MS Graph API endpoint. Please confirm if the endpoint inserted is correct and well-formated e.g. me/manager";
      }
    } else if (payload.TargetWorkloadId !== "Null" && payload.Team === "Null") {
      newMessage = "Team/Routing currently not found in this webapp's API.";
    } else {
      newMessage = `The ${endpoint} endpoint has the ${payload.TargetWorkloadId} TargetWorkloadId, which is within the support boundaries of the ${payload.Team} Support Team, in the ${payload.Routing} SAP.`;
    }

    setMessage(newMessage);
    setApiOutput(payload);
  }

  function RequestAPI(payload) {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequestAPI,
        account: accounts[0],
      })
      .then((response) => {
        callAPI(response.accessToken, payload).then((response) => {
          if (response.TargetWorkloadId !== undefined) {
            setResult(response);
            console.log("valid");
          } else {
            const invalidObj = {
              TargetWorkloadId: payload.TargetWorkloadId,
              Team: "Null",
              Routing: "Null",
            };
            console.log("invalid");
            setResult(invalidObj);
          }
        });
      });
  }

  return (
    <>
      {apiOutput ? (
        <Note
          apiOutput={apiOutput}
          endpoint={endpointOutput}
          message={message}
        />
      ) : (
        <p>
          Insert an endpoint (e.g.
          "https://graph.microsoft.com/v1.0/me/manager"):
        </p>
      )}
            <Select
    labelId="simple-select-label"
    id="simple-select"
    value={method}
    label="Method"
    sx={{ marginTop: 2, marginBottom: 2 }}
    onChange={handleMethodChange}
  >
    <MenuItem value={"GET"}>GET</MenuItem>
    <MenuItem value={"POST"}>POST</MenuItem>
    <MenuItem value={"PATCH"}>PATCH</MenuItem>
    <MenuItem value={"PUT"}>PUT</MenuItem>
    <MenuItem value={"DELETE"}>DELETE</MenuItem>
  </Select>
      <div>
        <TextField
          id="endpoint"
          name="title"
          value={endpoint}
          onChange={handleChange}
          placeholder="MS Graph Endpoint"
          fullWidth
          sx={{ marginTop: 2, marginBottom: 2 }}
        />
<div>
<TextField
          id="outlined-multiline-static"
          label="Body"
          value={body}
          onChange={handleBodyChange}
          multiline
          fullWidth
          rows={4}
          sx={{ marginTop: 2, marginBottom: 2 }}
        />
        <Button variant="contained" onClick={onButtonClick}>
          Submit
        </Button>
</div>
      </div>
    </>
  );
};

const Home = () => {
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
          <AuthenticatedTemplate>
            <ProfileContent />
          </AuthenticatedTemplate>

          <UnauthenticatedTemplate>
            <Typography
              variant="h5"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Sign In to use this Application!
            </Typography>
          </UnauthenticatedTemplate>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
