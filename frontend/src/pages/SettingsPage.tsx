import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

interface SettingsPageProps {
    onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
    const [activePanel, setActivePanel] = useState<"main" | "account" | "password">("main");

    const renderMainPanel = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                textAlign: "center",
                width: "40vh",
            }}
        >
            <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
                Settings
            </Typography>

            <Button
                variant="contained"
                fullWidth
                startIcon={<AccountCircleIcon />}
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => setActivePanel("account")}
            >
                Change Account Details
            </Button>

            <Button
                variant="contained"
                fullWidth
                startIcon={<LockIcon />}
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => setActivePanel("password")}
            >
                Change Password
            </Button>

            <Button
                variant="contained"
                fullWidth
                startIcon={<ExitToAppIcon />}
                sx={{
                    backgroundColor: "red",
                    "&:hover": { backgroundColor: "darkred" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => console.log("Logout clicked")}
            >
                Logout
            </Button>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    color: "white",
                    borderColor: "gray",
                    "&:hover": { borderColor: "white" },
                    mt: 2,
                    py: 1.5, // Add padding for better button height
                }}
                onClick={onClose}
            >
                Close
            </Button>
        </Box>
    );

    const renderAccountDetailsPanel = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                textAlign: "center",
                width: "40vh",
            }}
        >
            <Typography variant="h5" sx={{ mb: 4, textAlign: "center" }}>
                Change Account Details
            </Typography>

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => console.log("Account details saved")}
            >
                Save Changes
            </Button>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    color: "white",
                    borderColor: "gray",
                    "&:hover": { borderColor: "white" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => setActivePanel("main")}
            >
                Back
            </Button>
        </Box>
    );

    const renderChangePasswordPanel = () => (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                textAlign: "center",
                width: "40vh",
            }}
        >
            <Typography variant="h5" sx={{ mb: 4, textAlign: "center" }}>
                Change Password
            </Typography>

            <TextField
                fullWidth
                label="Current Password"
                type="password"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                variant="outlined"
                sx={{ backgroundColor: "white", borderRadius: 1 }}
            />
            <Button
                variant="contained"
                fullWidth
                sx={{
                    backgroundColor: "#2a5298",
                    "&:hover": { backgroundColor: "#1e3c72" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => console.log("Password changed")}
            >
                Save Password
            </Button>

            <Button
                variant="outlined"
                fullWidth
                sx={{
                    color: "white",
                    borderColor: "gray",
                    "&:hover": { borderColor: "white" },
                    py: 1.5, // Add padding for better button height
                }}
                onClick={() => setActivePanel("main")}
            >
                Back
            </Button>
        </Box>
    );

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                p: 0,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    height: 500, // Set consistent height for all panels
                    backgroundColor: "#1e3c72",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    color: "white",
                }}
            >
                {activePanel === "main" && renderMainPanel()}
                {activePanel === "account" && renderAccountDetailsPanel()}
                {activePanel === "password" && renderChangePasswordPanel()}
            </Box>
        </Box>
    );
};

export default SettingsPage;