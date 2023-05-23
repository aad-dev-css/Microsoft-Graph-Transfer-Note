import React from "react";
import { useMsal } from "@azure/msal-react";
import { Button } from "@mui/material";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <Button
      size="medium"
      variant="contained"
      sx={{ color: "white", backgroundColor: "gray" }}
      onClick={() => handleLogout()}
    >
      Sign Out
    </Button>
  );
};
