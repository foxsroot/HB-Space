import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout.tsx";
import PasswordField from "../components/PasswordField.tsx";
import AuthRedirectText from "../components/AuthRedirectText.tsx";
import AlertBox from "../components/AlertBox.tsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [alertActive, setAlertActive] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      setError(data.error);
      setAlertActive(true);

      setTimeout(() => {
        setAlertActive(false);
      }, 3000);

      return;
    }

    navigate("/profile");
  };

  return (
    <>
      <AuthLayout>
        <Typography variant="h4" gutterBottom color="primary">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleRegister} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={!!error}
          />
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            error={!!error}
          />
          <PasswordField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
          <PasswordField
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#1e3c72",
              "&:hover": { backgroundColor: "#2a5298" },
            }}
          >
            Register
          </Button>
        </Box>
        <AuthRedirectText
          message="Already have an account?"
          linkText="Login"
          linkHref="/login"
        />
      </AuthLayout>
      {alertActive && (
        <AlertBox severity="error" onClose={() => setAlertActive(false)}>
          {error}
        </AlertBox>
      )}
    </>
  );
};

export default Register;
