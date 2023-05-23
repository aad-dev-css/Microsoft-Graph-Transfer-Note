import { AppBar, CssBaseline, Toolbar, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AdbIcon from "@mui/icons-material/Adb";
import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import SosIcon from "@mui/icons-material/Sos";

const pages = [
  { name: "Home", route: "/" },
  { name: "Feedback", route: "/feedback" },
  { name: "Roadmap", route: "/roadmap" },
];

const Navbar = () => {
  const isAuthenticated = useIsAuthenticated();
  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          {/* <SosIcon sx={{ mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MS Graph Router Helper
          </Typography>
          <Box mr={2}>
            {pages.map((item) => (
              <Button key={item.name} sx={{ color: "#fff" }} href={item.route}>
                {item.name}
              </Button>
            ))}
          </Box>
          <Box>{isAuthenticated ? <SignOutButton /> : <SignInButton />}</Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
