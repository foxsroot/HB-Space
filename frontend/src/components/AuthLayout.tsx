import { Box, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: `${theme.palette.secondary.main}`,
        // background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
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
          color: `${theme.palette.primary.main}`,
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default AuthLayout;
