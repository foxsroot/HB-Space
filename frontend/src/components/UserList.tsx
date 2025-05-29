import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  isFollowing?: boolean;
  loading?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  users: User[];
  title: string;
  currentUserId?: string; // Add this prop
}

const UserListDialog = ({
  open,
  onClose,
  users,
  title,
  currentUserId, // Destructure here
}: Props) => {
  const [userList, setUserList] = useState(users);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  const handleFollowToggle = async (userId: string) => {
    setUserList((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, loading: true } : user
      )
    );
    const httpMethod = userList.find((user) => user.id === userId)?.isFollowing
      ? "DELETE"
      : "POST";
    const url = `${import.meta.env.VITE_API_BASE_URL}/user/${userId}/followers`;
    try {
      const res = await fetch(url, {
        method: httpMethod,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        setUserList((prev) =>
          prev.map((user) =>
            user.id === userId
              ? { ...user, isFollowing: !user.isFollowing, loading: false }
              : user
          )
        );
      } else {
        setUserList((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, loading: false } : user
          )
        );
      }
    } catch {
      setUserList((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, loading: false } : user
        )
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          background: "#181818",
          color: "white",
          borderRadius: 3,
        },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backgroundColor: "rgba(20, 22, 28, 0.95)",
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "#181818",
          color: "white",
          borderBottom: "1px solid #222",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700}>{title}</Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: 320,
          overflowY: "auto",
          px: 2,
          py: 0,
          background: "#181818",
        }}
      >
        <List>
          {userList.length === 0 && (
            <Typography color="gray" textAlign="center" py={2}>
              No users found.
            </Typography>
          )}
          {userList.map((user) => (
            <ListItem
              key={user.id}
              sx={{ px: 0, py: 1, borderBottom: "1px solid #222" }}
              secondaryAction={
                user.id !== currentUserId ? (
                  <Button
                    variant={user.isFollowing ? "outlined" : "contained"}
                    size="small"
                    onClick={() => handleFollowToggle(user.id)}
                    disabled={user.loading}
                    sx={{
                      color: user.isFollowing ? "#e52e71" : "white",
                      background: user.isFollowing ? "transparent" : "#e52e71",
                      borderColor: "#e52e71",
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 90,
                      boxShadow: "none",
                      "&:hover": {
                        background: user.isFollowing ? "#222" : "#c2185b",
                        borderColor: "#e52e71",
                      },
                    }}
                  >
                    {user.loading ? (
                      <span style={{ display: "flex", alignItems: "center" }}>
                        <span
                          className="MuiCircularProgress-root MuiCircularProgress-colorInherit"
                          style={{
                            width: 18,
                            height: 18,
                            marginRight: 6,
                          }}
                        >
                          <svg
                            viewBox="22 22 44 44"
                            style={{ width: 18, height: 18 }}
                          >
                            <circle
                              cx="44"
                              cy="44"
                              r="20.2"
                              fill="none"
                              strokeWidth="3.6"
                              stroke="#e52e71"
                              strokeDasharray="126.92 44.64"
                            />
                          </svg>
                        </span>
                      </span>
                    ) : user.isFollowing ? (
                      "Following"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                ) : null
              }
            >
              <ListItemAvatar>
                <Link
                  to={`/${user.username}`}
                  style={{ textDecoration: "none" }}
                  onClick={onClose}
                >
                  <Avatar
                    src={user.avatarUrl || "/default.png"}
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "#222",
                      color: "white",
                      mr: 2,
                    }}
                  >
                    {user.username[0]?.toUpperCase()}
                  </Avatar>
                </Link>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Link
                    to={`/${user.username}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={onClose}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "white", fontWeight: 600 }}
                    >
                      {user.username}
                    </Typography>
                  </Link>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;
