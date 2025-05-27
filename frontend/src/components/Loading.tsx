import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ text = "Loading..." }: { text?: string }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="200px"
    width="100%"
    gap={2}
  >
    <CircularProgress color="secondary" />
    <Typography sx={{ color: "#bbb" }}>{text}</Typography>
  </Box>
);

export default Loading;
