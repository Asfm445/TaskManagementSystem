import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 80;

const DashboardLayout = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Check if the screen size is large
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isMediumScreen=useMediaQuery((theme)=>theme.breakpoints.between("sm","md"))
  const [isCollapsed, setIsCollapsed] = useState(isMediumScreen);

  const handleDrawerToggle = () => {
    if (isLargeScreen || isMediumScreen) {
      setIsCollapsed(!isCollapsed); // Toggle collapse state
    } else {
      setOpen(!open); // Toggle open/close state for small screens
      setIsCollapsed(false);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Task Progress Tracker
          </Typography>
          <Button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            sx={{ marginLeft: "auto", color: "white" }}
            variant="contained"
            color="secondary"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
            boxSizing: "border-box",
          },
        }}
        variant={isLargeScreen || isMediumScreen ? "persistent" : "temporary"}
        anchor="left"
        open={isLargeScreen || isMediumScreen ? true : open} // Always open on large screens
        onClose={!isLargeScreen ? () => setOpen(false) : undefined}
      >
        <Toolbar />
        {/* <Collapse in={!isCollapsed} timeout={500}> */}{" "}
        {/* Adjust timeout here */}
        <List>
          {["Continuous Task", "Fixed Task"].map((text, index) => {
            const displayText = isCollapsed
              ? text === "Continuous Task"
                ? "CT"
                : "FT"
              : text;
            return (
              <ListItem
                sx={{ cursor: "pointer" }}
                button
                key={text}
                onClick={() => {
                  if (!isLargeScreen) setOpen(false); // Close drawer on small screens after selection
                  props.setRender(text.split(" ")[0]);
                }}
              >
                <ListItemText primary={displayText} />
              </ListItem>
            );
          })}
        </List>
        {/* </Collapse> */}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        {/* Render the main content here */}
        {props.children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
