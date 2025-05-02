import { Box, Link, Typography } from "@mui/material";

interface AuthRedirectTextProps {
  message: string;
  linkText: string;
  linkHref: string;
}

const AuthRedirectText = ({
  message,
  linkText,
  linkHref,
}: AuthRedirectTextProps) => (
  <Box mt={3}>
    <Typography variant="body2">
      {message}{" "}
      <Link href={linkHref} underline="hover" fontWeight="bold" color="primary">
        {linkText}
      </Link>
    </Typography>
  </Box>
);

export default AuthRedirectText;
