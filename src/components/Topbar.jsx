import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";

function Topbar() {
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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Pellet Stove Monitoring Platform
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
            Dorah Nanyangwe
          </Typography>

          <Avatar>D</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;