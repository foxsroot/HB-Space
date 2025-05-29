import { Box, Typography, Avatar, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState, useEffect } from "react";
import SettingsPage from "../pages/SettingsPage";
import CreatePost from "../pages/CreatePost";

const navItemSx = {
  borderRadius: 2,
  transition: "background 0.2s",
  px: 4, // increase horizontal padding
  py: 2, // increase vertical padding
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "#fff",
  width: "92%", // make menu wider, almost full width
  minHeight: 56, // increase height for each menu item
  boxSizing: "border-box",
  fontWeight: 400,
  fontSize: "1.1rem", // slightly larger font
  "&:hover": {
    backgroundColor: "#232323",
    cursor: "pointer",
    textDecoration: "none",
    color: "#fff",
  },
};

const Navbar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleOpenSettings = () => setIsSettingsOpen(true);
  const handleCloseSettings = () => setIsSettingsOpen(false);
  const handleOpenCreate = () => setIsCreateOpen(true);
  const handleCloseCreate = () => setIsCreateOpen(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user profile");
        const data = await res.json();
        setProfilePicture(data.user.profilePicture);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        pl: 0,
        px: 0,
        color: "#fff",
        borderRight: "1px solid #222",
      }}
    >
      <Link to="/feed" style={{ textDecoration: "none", width: "100%" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mt: 2,
            pl: 3,
            mb: 2,
            color: "#fff",
            fontFamily: "'Pacifico', cursive", 
            letterSpacing: 1,
          }}
        >
          HB Space
        </Typography>
      </Link>

      <Link
        to="/feed"
        style={{ textDecoration: "none", display: "block", width: "100%" }}
      >
        <Box sx={navItemSx}>
          <HomeIcon sx={{ color: "#fff", mr: 2 }} />
          <Typography sx={{ fontWeight: 400 }}>Home</Typography>
        </Box>
      </Link>

      <Link
        to="/explore"
        style={{ textDecoration: "none", display: "block", width: "100%" }}
      >
        <Box sx={navItemSx}>
          <SearchIcon sx={{ color: "#fff", mr: 2 }} />
          <Typography sx={{ fontWeight: 400 }}>Explore</Typography>
        </Box>
      </Link>

      <Box sx={navItemSx} onClick={handleOpenCreate}>
        <AddCircleOutlineIcon sx={{ color: "#fff", mr: 2 }} />
        <Typography sx={{ fontWeight: 400 }}>Create</Typography>
      </Box>

      {/* Profile is now directly below Create */}
      <Link
        to="/profile"
        style={{
          textDecoration: "none",
          display: "block",
          width: "100%",
        }}
      >
        <Box sx={{ ...navItemSx }}>
          <Avatar
            sx={{ width: 32, height: 32, mr: 2, bgcolor: "#2a5298" }}
            src={
              profilePicture
                ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${profilePicture}`
                : "/default.png"
            }
          />
          <Typography sx={{ fontWeight: 400 }}>Profile</Typography>
        </Box>
      </Link>

      {/* Settings is now at the bottom */}
      <Box
        sx={{ ...navItemSx, mt: "auto", mb: 2 }}
        onClick={handleOpenSettings}
      >
        <SettingsIcon sx={{ color: "#fff", mr: 2 }} />
        <Typography sx={{ fontWeight: 400 }}>Settings</Typography>
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
        <CreatePost open={isCreateOpen} onClose={handleCloseCreate} />
      </Modal>
    </Box>
  );
};

export default Navbar;
