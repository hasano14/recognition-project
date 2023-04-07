import React from "react";
import { Drawer, List, Divider, ListItem, ListItemText } from "@mui/material";

const drawerWidth = 240;

const items = [
  {
    href: "/",
    title: "Dashboard",
  },
  {
    href: "/native",
    title: "Native English Speaker",
  },
  {
    href: "/nonnative",
    title: "Non-Native English Speaker",
  },
];

const Sidebar = (active) => {
  return (
    <div>
      <Drawer variant="permanent">
        <div />
        <div>
          <List>
            <ListItem>
              <ListItemText primary="Native Speakers" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Non-Native Speakers" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;
