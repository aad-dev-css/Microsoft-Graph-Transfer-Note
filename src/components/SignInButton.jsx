import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequestAPI } from "../authConfig";
import { Button } from "@mui/material";

/**
 * Renders a sign in button
 */
export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequestAPI).catch((e) => {
      console.log(e);
    });
  };
  return (
    <Button
      size="medium"
      variant="contained"
      sx={{ color: "white", backgroundColor: "gray" }}
      onClick={() => handleLogin()}
    >
      Sign In
    </Button>
  );
};
