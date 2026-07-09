import { useNavigate } from "react-router-dom";

import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    Button
} from "@mui/material";

function Topbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    function handleLogout() {

        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        navigate("/login");

    }

    return (

        <AppBar
            position="static"
            sx={{
                backgroundColor: "#111827",
                boxShadow: "none",
                borderBottom: "1px solid #1f2937"
            }}
        >

            <Toolbar>

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    Pellet Stove Monitoring Platform
                </Typography>

                <Box
                    display="flex"
                    alignItems="center"
                    gap={2}
                >

                    <Typography variant="body2">

                        {user?.full_name}

                    </Typography>

                    <Avatar>

                        {user?.full_name?.charAt(0)}

                    </Avatar>

                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>

                </Box>

            </Toolbar>

        </AppBar>

    );

}

export default Topbar;