import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import AlertBox from "../components/AlertBox";
import { useUserContext } from "../contexts/UserContext";

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const [activePanel, setActivePanel] = useState<
    "main" | "account" | "password"
  >("main");
  const navigate = useNavigate();

  // States for account update
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // States for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { setCurrentUser } = useUserContext();

  // Alert state
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: "success" | "info" | "warning" | "error";
    message: string;
  }>({ open: false, severity: "info", message: "" });

  const showAlert = (
    severity: "success" | "info" | "warning" | "error",
    message: string
  ) => {
    setAlert({ open: true, severity, message });
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  const updateAccountDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return showAlert("error", "Not authenticated");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      if (res.ok) {
        showAlert("success", "Account details updated successfully");
        setActivePanel("main");
      } else {
        const err = await res.json();
        showAlert(
          "error",
          "Update failed: " + (err.error || err.message || res.statusText)
        );
      }
    } catch (error) {
      showAlert("error", "An error occurred while updating account details.");
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      return showAlert("warning", "New passwords do not match");
    }
    const token = localStorage.getItem("token");
    if (!token) return showAlert("error", "Not authenticated");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      if (res.ok) {
        showAlert("success", "Password changed successfully");
        setActivePanel("main");
      } else {
        const err = await res.json();
        showAlert(
          "error",
          "Failed to change password: " + (err.error || res.statusText)
        );
      }
    } catch (error) {
      showAlert("error", "An error occurred while changing password.");
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return showAlert("error", "Not authenticated");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        localStorage.removeItem("token");
        setCurrentUser(undefined);
        showAlert("success", "Logout successful");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        const err = await res.json();
        showAlert("error", "Logout failed: " + (err.message || res.statusText));
      }
    } catch (error) {
      showAlert("error", "An error occurred during logout.");
    }
  };

  // Fetch current user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUsername(data.user.username || "");
          setEmail(data.user.email || "");
        }
      } catch (error) {
        // Optionally show an alert here
      }
    };
    fetchUser();
  }, []);

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
      <Typography
        variant="h5"
        sx={{ mb: 4, textAlign: "center", color: "#fff" }}
      >
        Change Account Details
      </Typography>

      <TextField
        fullWidth
        label="Username"
        variant="outlined"
        sx={{
          backgroundColor: "#23272f",
          borderRadius: 1,
          input: { color: "#fff" },
          label: { color: "#aaa" },
        }}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        InputLabelProps={{ style: { color: "#aaa" } }}
      />
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        sx={{
          backgroundColor: "#23272f",
          borderRadius: 1,
          input: { color: "#fff" },
          label: { color: "#aaa" },
        }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        InputLabelProps={{ style: { color: "#aaa" } }}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{
          background: "linear-gradient(90deg, #23272f 0%, #2a5298 100%)",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "none",
          border: "1px solid #2a2d34",
          "&:hover": {
            background: "#1e3c72",
            color: "#fff",
            border: "1px solid #1e3c72",
          },
          py: 1.5,
        }}
        onClick={updateAccountDetails}
      >
        Save Changes
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          color: "#fff",
          borderColor: "#444b5a",
          backgroundColor: "#23272f",
          "&:hover": { borderColor: "#fff", backgroundColor: "#23272f" },
          py: 1.5,
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
      <Typography
        variant="h5"
        sx={{ mb: 4, textAlign: "center", color: "#fff" }}
      >
        Change Password
      </Typography>

      <TextField
        fullWidth
        label="Current Password"
        type="password"
        variant="outlined"
        sx={{
          backgroundColor: "#23272f",
          borderRadius: 1,
          input: { color: "#fff" },
          label: { color: "#aaa" },
        }}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#aaa" } }}
      />
      <TextField
        fullWidth
        label="New Password"
        type="password"
        variant="outlined"
        sx={{
          backgroundColor: "#23272f",
          borderRadius: 1,
          input: { color: "#fff" },
          label: { color: "#aaa" },
        }}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#aaa" } }}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        type="password"
        variant="outlined"
        sx={{
          backgroundColor: "#23272f",
          borderRadius: 1,
          input: { color: "#fff" },
          label: { color: "#aaa" },
        }}
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        InputLabelProps={{ style: { color: "#aaa" } }}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{
          background: "linear-gradient(90deg, #23272f 0%, #2a5298 100%)",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "none",
          border: "1px solid #2a2d34",
          "&:hover": {
            background: "#1e3c72",
            color: "#fff",
            border: "1px solid #1e3c72",
          },
          py: 1.5,
        }}
        onClick={changePassword}
      >
        Save Password
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          color: "#fff",
          borderColor: "#444b5a",
          backgroundColor: "#23272f",
          "&:hover": { borderColor: "#fff", backgroundColor: "#23272f" },
          py: 1.5,
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
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(20, 22, 28, 0.95)",
        backdropFilter: "blur(5px)",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          height: 500,
          background: "linear-gradient(135deg, #23272f 0%, #23272f 100%)",
          borderRadius: 2,
          p: 4,
          pr: 4, // ensure right padding matches left
          pl: 4, // ensure left padding matches right
          boxShadow: 8,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          color: "#fff",
        }}
      >
        {activePanel === "main" && (
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
            <Typography
              variant="h4"
              sx={{ mb: 4, textAlign: "center", color: "#fff" }}
            >
              Settings
            </Typography>

            <Button
              variant="contained"
              fullWidth
              startIcon={<AccountCircleIcon />}
              sx={{
                background: "#23272f",
                color: "#fff",
                fontWeight: 700,
                boxShadow: "none",
                border: "1px solid #444b5a",
                "&:hover": {
                  background: "#2a5298",
                  color: "#fff",
                  border: "1px solid #2a5298",
                },
                py: 1.5,
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
                background: "#23272f",
                color: "#fff",
                fontWeight: 700,
                boxShadow: "none",
                border: "1px solid #444b5a",
                "&:hover": {
                  background: "#2a5298",
                  color: "#fff",
                  border: "1px solid #2a5298",
                },
                py: 1.5,
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
                background: "#e74c3c",
                color: "#fff",
                fontWeight: 700,
                boxShadow: "none",
                border: "1px solid #c0392b",
                "&:hover": {
                  background: "#c0392b",
                  color: "#fff",
                  border: "1px solid #a93226",
                },
                py: 1.5,
              }}
              onClick={logout}
            >
              Logout
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                color: "#fff",
                borderColor: "#444b5a",
                backgroundColor: "#23272f",
                "&:hover": {
                  borderColor: "#fff",
                  color: "#fff",
                  backgroundColor: "#23272f",
                },
                mt: 2,
                py: 1.5,
                fontWeight: 600,
              }}
              onClick={onClose}
            >
              Close
            </Button>
          </Box>
        )}
        {activePanel === "account" && renderAccountDetailsPanel()}
        {activePanel === "password" && renderChangePasswordPanel()}
      </Box>
      {alert.open && (
        <AlertBox severity={alert.severity} onClose={handleCloseAlert}>
          {alert.message}
        </AlertBox>
      )}
    </Box>
  );
};

export default SettingsPage;
