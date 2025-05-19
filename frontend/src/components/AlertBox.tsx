import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import { ReactNode } from "react";

interface Props {
  severity: "success" | "info" | "warning" | "error";
  variant?: "outlined" | "filled";
  children: ReactNode;
  onClose: () => void;
}

export default function AlertBox({
  severity,
  variant = "filled",
  children,
  onClose,
}: Props) {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "10vh",
        right: "20px",
        zIndex: 9999,
        width: "30vw",
      }}
    >
      <Alert variant={variant} severity={severity} onClose={onClose}>
        {children}
      </Alert>
    </Box>
  );
}
