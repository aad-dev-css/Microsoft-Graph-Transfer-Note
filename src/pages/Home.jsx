import React, { useState } from "react";
import "../styles/App.css";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import {
  InteractionRequiredAuthError
} from "@azure/msal-browser";
import { loginRequestGraph } from "../authConfig";
import { loginRequestAPI } from "../authConfig";
import { callMsGraph } from "../graph";
import { callAPI } from "../graph";
import { submitHelpful } from "../graph";
import { Note } from "../components/Note";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Box,
  Container,
  Toolbar,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  ButtonGroup
} from "@mui/material";

const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [apiOutput, setApiOutput] = useState(null);
  const [showIsThisHelpfulButtons, setIsThisHelpfulButtons] = useState(false);
  const [endpoint, setEndpoint] = useState("");
  const [endpointOutput, setEndpointOutput] = useState("");
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [helpfulMessageText, setHelpfulMessage] = useState("");

  const handleChange = (event) => {
    setEndpoint(event.target.value);
  };

  const copyToClipboard = () => navigator.clipboard.writeText(message)

  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };

  const onButtonClick = () => {
    RequestWhatIf(endpoint, method, body);
  };

  const handleMethodChange = (event) => {
    setMethod(event.target.value);
  };

  function RequestWhatIf(endpoint, method, body) {
    setEndpointOutput(endpoint);
    setMethod(method)
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequestGraph,
        account: accounts[0],
      }).catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequestGraph,
            account: accounts[0],
          });
        }
      })
      .then((response) => {
        callMsGraph(response.accessToken, endpoint, method, body).then((response) => {
          var workloadsIds = [];
          var responses = [];

          if (response.hasOwnProperty('TargetWorkloadId') === true) {
            workloadsIds.push(response.TargetWorkloadId);
          } else {
            for (const key in response) {
              const nestedProp = response[key]
              if (nestedProp.hasOwnProperty('TargetWorkloadId')) {
                workloadsIds.push(nestedProp.TargetWorkloadId);
              }

            }

          }
          if (workloadsIds.length === 0) {
            const invalidObj = {
              TargetWorkloadId: "Null",
              Team: "Null",
              Routing: "Null",
            }
            workloadsIds.push(invalidObj);
            var isBadRequest = false;
            if (response.error.message.includes("JSON")) isBadRequest = true;
            setResult(workloadsIds, isBadRequest);
          } else {
            RequestAPI(responses, workloadsIds)
          }
        });
      });
  }

  function setResult(responses, isBadRequest) {
    var newMessage = "";
    var includesMoreTeams = false;
    if (responses.length > 1) {
      responses.forEach((response, index) => {
        if (index !== 0) {
          if (!responses[0].TargetWorkloadId.includes(response.TargetWorkloadId)) responses[0].TargetWorkloadId += " + " + response.TargetWorkloadId;
          if (!responses[0].Team.includes(response.Team)) {
            responses[0].Team += " + " + response.Team;
            includesMoreTeams = true;
          }
          if (!responses[0].Routing.includes(response.Routing)) responses[0].Routing += " + " + response.Routing;
        }
      })
    }
    if (responses[0].TargetWorkloadId === "Null") {
      if (isBadRequest) {
        newMessage =
          "Bad request (Unable to read JSON request payload). Please validate or fill request body.";
      } else {
        newMessage =
          "Invalid MS Graph API endpoint. Please confirm if the endpoint inserted is correct and well-formated e.g. me/manager";
      }
    } else {
      newMessage = ` • The ${endpoint} endpoint has the ${responses[0].TargetWorkloadId} TargetWorkloadIds \n • This workload is within the support boundaries of ${responses[0].Team} Support Teams \n • The corresponding SAPs are: ${responses[0].Routing}`;
      if (includesMoreTeams) newMessage += " \n The respective team to handle the case depends on the issue being faced."
      if (responses[0].Team.includes("Null") || responses[0].Routing.includes("Null")) newMessage += " \n One or more Teams/SAPs were returned as Null. Do not use the note as it is, instead please report this in our Feedback form, describing the endpoint and the method used."
    }

    setMessage(newMessage);
    setApiOutput(responses[0]);
    setHelpfulMessage("Is this useful?")
    setIsThisHelpfulButtons(true);
  }

  function helpfulMessage() {
    setIsThisHelpfulButtons(false)
    setHelpfulMessage("Thank you for your feedback!")
    instance
      .acquireTokenSilent({
        ...loginRequestAPI,
        account: accounts[0],
      }).catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequestAPI,
            account: accounts[0],
          });
        }
      })
      .then((response) => {
        submitHelpful(response.accessToken, true)
      })
  }

  function notHelpfulMessage() {
    setIsThisHelpfulButtons(false)
    setHelpfulMessage("Thank you for your feedback! Please let us know how we can improve in the Feedback tab.")
    instance
      .acquireTokenSilent({
        ...loginRequestAPI,
        account: accounts[0],
      }).catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequestAPI,
            account: accounts[0],
          });
        }
      })
      .then((response) => {
        submitHelpful(response.accessToken, false)
      })
  }

  function RequestAPI(responses, workloadsIds) {
    instance
      .acquireTokenSilent({
        ...loginRequestAPI,
        account: accounts[0],
      }).catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect({
            ...loginRequestAPI,
            account: accounts[0],
          });
        }
      })
      .then((response) => {
        callAPI(response.accessToken, workloadsIds[responses.length]).then((output) => {
          if (output.TargetWorkloadId !== undefined) {
            responses.push(output)
          } else {
            const invalidObj = {
              TargetWorkloadId: workloadsIds[responses.length],
              Team: "Null",
              Routing: "Null",
            };
            responses.push(invalidObj)
          }

          if (responses.length === workloadsIds.length) {
            setResult(responses, false)
          } else {
            RequestAPI(responses, workloadsIds)
          }
        });
      });
  }

  return (
    <>
      {apiOutput ? (<div>
        <Note
          apiOutput={apiOutput}
          endpoint={endpointOutput}
          message={message}
        />
        <Button onClick={copyToClipboard} sx={{ marginTop: 2, marginBottom: 2 }}>Copy to Clipboard</Button>
      </div>) : (
        <p>
          Insert an endpoint (e.g.
          "https://graph.microsoft.com/v1.0/me/manager"):
        </p>
      )}


      <div>
        <p>{helpfulMessageText}</p>
        {showIsThisHelpfulButtons && (
          <div>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button onClick={helpfulMessage}>Yes</Button>
              <Button onClick={notHelpfulMessage}>No</Button>
            </ButtonGroup>
          </div>
        )}

      </div>


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
      <Container maxWidth="false" sx={{ paddingLeft: "0px !important" }}> <Footer /></Container>
    </div>
  );
};

export default Home;
