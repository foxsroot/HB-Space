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
  variant = "outlined",
  children,
  onClose,
}: Props) {
  return (
    <Alert variant={variant} severity={severity} onClose={onClose}>
      {children}
    </Alert>
  );
}
