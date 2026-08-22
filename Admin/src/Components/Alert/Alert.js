import React from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

// Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Success Alert Component
export const SuccessAlert = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="success" sx={{ width: "auto" }}>
      {message}
    </Alert>
  </Snackbar>
);

// Info Alert Component
export const InfoAlert = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="info" sx={{ width: "auto" }}>
      {message}
    </Alert>
  </Snackbar>
);

// Warning Alert Component
export const WarningAlert = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="warning" sx={{ width: "auto" }}>
      {message}
    </Alert>
  </Snackbar>
);

// Danger Alert Component (Error)
export const DangerAlert = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="error" sx={{ width: "auto" }}>
      {message}
    </Alert>
  </Snackbar>
);

// Success Alert Login Component
export const SuccessLogin = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

// Danger Alert Login Component (Error)
export const DangerLogin = ({
  open,
  onClose,
  message,
  vertical = "top",
  horizontal = "right",
}) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical, horizontal }}
  >
    <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);
