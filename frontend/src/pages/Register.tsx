import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);
    // Add your registration logic here (e.g., API call)
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #1e3c72, #2a5298)',
        m: 0,
        p: 0,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: 400,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
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
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={!!error}
            helperText={error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: '#1e3c72', '&:hover': { backgroundColor: '#2a5298' } }}
          >
            Register
          </Button>
        </Box>

        <Box mt={3}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link href="/login" underline="hover" fontWeight="bold" color="primary">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Register;
