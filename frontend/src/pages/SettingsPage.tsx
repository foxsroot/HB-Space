import React from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";

const SettingsPage = () => {
  const handleSave = () => {
    // Logic to save settings
    console.log("Settings saved!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "white",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#1e3c72",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Account Settings
        </Typography>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ mb: 3, backgroundColor: "white", borderRadius: 1 }}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "#2a5298",
            "&:hover": { backgroundColor: "#1e3c72" },
          }}
          onClick={handleSave}
        >
          Save Changes
        </Button>

        <Divider sx={{ my: 4, backgroundColor: "white" }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Danger Zone
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: "red",
            "&:hover": { backgroundColor: "darkred" },
          }}
        >
          Delete Account
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;