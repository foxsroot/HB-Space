import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout.tsx";
import AuthRedirectText from "../components/AuthRedirectText.tsx";
import PasswordField from "../components/PasswordField.tsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      const data = (await response).json();
    } catch (error) {
      console.log("Login failed");
    }

    window.location.href = "/profile";
  };

  return (
    <AuthLayout>
      <Typography variant="h4" gutterBottom color="primary">
        Login
      </Typography>
      <Box component="form" onSubmit={handleLogin} noValidate>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Login
        </Button>
      </Box>
      <AuthRedirectText
        message="Don't have an account?"
        linkText="Sign up"
        linkHref="/register"
      />
    </AuthLayout>
  );
};

export default Login;
