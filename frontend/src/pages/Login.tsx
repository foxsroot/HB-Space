import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AuthLayout from "../components/AuthLayout.tsx";
import AuthRedirectText from "../components/AuthRedirectText.tsx";
import PasswordField from "../components/PasswordField.tsx";
import AlertBox from "../components/AlertBox.tsx";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext.tsx";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alertActive, setAlertActive] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, setCurrentUser } = useUserContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier: email, password }),
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

      localStorage.setItem("token", data.token);

      setCurrentUser({
        userId: data.userId,
        username: data.username,
        email: data.email,
        profilePicture: data.profilePicture || "",
        fullName: data.fullName || "",
      });

      navigate(`/${data.username}`);
    } catch (error) {
      console.log("Login failed");
    }
  };

  return (
    <>
      <AuthLayout>
        <Typography variant="h4" gutterBottom color="primary">
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            label="Email / Username"
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

      {alertActive && (
        <AlertBox severity="error" onClose={() => setAlertActive(false)}>
          {error}
        </AlertBox>
      )}
    </>
  );
};

export default Login;
