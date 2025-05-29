import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import "./css/index.css";
import theme from "./theme.ts";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Profile from "./pages/Profile.tsx";
import Development from "./pages/Development.tsx";
import Explore from "./pages/Explore.tsx";
import Feed from "./pages/Feed.tsx";
import { UserProvider } from "./contexts/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider theme={theme}>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/development" element={<Development />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </ThemeProvider>
  // </StrictMode>
);
