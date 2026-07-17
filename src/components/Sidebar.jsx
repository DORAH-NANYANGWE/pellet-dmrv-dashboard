import { Link } from "react-router-dom";

import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    ListItemIcon
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AssessmentIcon from "@mui/icons-material/Assessment";
import VerifiedIcon from "@mui/icons-material/Verified";
import OutdoorGrillIcon from "@mui/icons-material/OutdoorGrill";

const drawerWidth = 240;

function Sidebar() {

    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.role;

    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: "#0f172a",
                    color: "#ffffff"
                }
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold" }}
                >
                    Pellet DMRV
                </Typography>

            </Toolbar>

            <List>

                {/* Dashboard */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/dashboard"
                    >

                        <ListItemIcon sx={{ color: "#ffffff" }}>
                            <DashboardIcon />
                        </ListItemIcon>

                        <ListItemText primary="Dashboard" />

                    </ListItemButton>

                </ListItem>

                {/* Fleet */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/fleet"
                    >

                        <ListItemIcon sx={{ color: "#ffffff" }}>
                            <LocalFireDepartmentIcon />
                        </ListItemIcon>

                        <ListItemText primary="Fleet" />

                    </ListItemButton>

                </ListItem>

                {/* Cooking Sessions */}

                <ListItem disablePadding>

                    <ListItemButton
                        component={Link}
                        to="/cooking-sessions"
                    >

                        <ListItemIcon sx={{ color: "#ffffff" }}>
                            <OutdoorGrillIcon />
                        </ListItemIcon>

                        <ListItemText primary="Cooking Sessions" />

                    </ListItemButton>

                </ListItem>

                {/* Reports */}

                {(role === "Management" || role === "Administrator") && (

                    <ListItem disablePadding>

                        <ListItemButton
                            component={Link}
                            to="/reports"
                        >

                            <ListItemIcon sx={{ color: "#ffffff" }}>
                                <AssessmentIcon />
                            </ListItemIcon>

                            <ListItemText primary="Reports" />

                        </ListItemButton>

                    </ListItem>

                )}

                {/* User Management */}

                {role === "Administrator" && (

                    <ListItem disablePadding>

                        <ListItemButton
                            component={Link}
                            to="/users"
                        >

                            <ListItemIcon sx={{ color: "#ffffff" }}>
                                <VerifiedIcon />
                            </ListItemIcon>

                            <ListItemText primary="User Management" />

                        </ListItemButton>

                    </ListItem>

                )}

            </List>

        </Drawer>

    );

}

export default Sidebar;