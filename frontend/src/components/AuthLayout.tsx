import { Box, Paper } from "@mui/material";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
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
          textAlign: "center",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;
