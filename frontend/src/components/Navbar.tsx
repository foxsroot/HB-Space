import { Box, Typography, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";

interface Props {
  onCreateClick: () => void;
}

const Navbar = ({ onCreateClick }: Props) => {
  return (
    <Box
      sx={{
        width: 200,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "#1e3c72",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pl: 2,
        px: 2,
        color: "white",
      }}
    >
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, mt: 2 }}>
        HB Space
      </Typography>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <HomeIcon sx={{ color: "white", mr: 2 }} />
        <Link to="/feed" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Home</Typography>
        </Link>
      </Box>

      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <SearchIcon sx={{ color: "white", mr: 2 }} />
        <Link to="/explore" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Explore</Typography>
        </Link>
      </Box>

      <Box
        display="flex"
        alignItems="center"
        sx={{ mb: 3 }}
        onClick={onCreateClick}
        style={{ cursor: "pointer" }}
      >
        <AddCircleOutlineIcon sx={{ color: "white", mr: 2 }} />
        <Typography>Create</Typography>
      </Box>

      {/* Settings Section */}
      <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
        <SettingsIcon sx={{ color: "white", mr: 2 }} />
        <Link to="/settings" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Settings</Typography>
        </Link>
      </Box>

      {/* Profile Link Section */}
      <Box display="flex" alignItems="center" sx={{ mt: "auto", mb: 2 }}>
        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: "#2a5298" }}>
          HSW
        </Avatar>
        <Link to="/profile" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Profile</Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default Navbar;
