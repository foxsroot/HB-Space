import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout.tsx";
import PasswordField from "../components/PasswordField.tsx";
import AuthRedirectText from "../components/AuthRedirectText.tsx";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log("Email:", email);
    console.log("Username:", username);
    console.log("Password:", password);
    // Call your API here
  };

  return (
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
        />
        <TextField
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
  );
};

export default Register;
