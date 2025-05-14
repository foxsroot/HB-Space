import { Box, Typography, Avatar, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import SettingsPage from "../pages/SettingsPage";
import CreatePostPage from "../pages/Create";

// interface Props {
//   onCreateClick: () => void;
// }

// const Navbar = ({ onCreateClick }: Props) => {
const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
  };

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

      {/* Create Post Section */}
      <Box
        display="flex"
        alignItems="center"
        sx={{ mb: 3 }}
        // onClick={onCreateClick}
        onClick={handleOpenCreate}
        style={{ cursor: "pointer" }}
      >
        <AddCircleOutlineIcon sx={{ color: "white", mr: 2 }} />
        <Typography>Create</Typography>
      </Box>

      {/* Settings Section */}
      <Box
        display="flex"
        alignItems="center"
        sx={{ mb: 3, cursor: "pointer" }}
        onClick={handleOpenSettings}
      >
        <SettingsIcon sx={{ color: "white", mr: 2 }} />
        <Typography>Settings</Typography>
      </Box>

      <Box display="flex" alignItems="center" sx={{ mt: "auto", mb: 2 }}>
        <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: "#2a5298" }}>
          HSW
        </Avatar>
        <Link to="/profile" style={{ textDecoration: "none", color: "white" }}>
          <Typography>Profile</Typography>
        </Link>
      </Box>

      <Modal
        open={isSettingsOpen}
        onClose={handleCloseSettings}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <SettingsPage onClose={handleCloseSettings} />
      </Modal>

      <Modal
        open={isCreateOpen}
        onClose={handleCloseCreate}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(5px)",
        }}
      >
        <CreatePostPage onClose={handleCloseCreate} />
      </Modal>
    </Box>
  );
};

export default Navbar;
