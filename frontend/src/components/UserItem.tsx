import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  username: string;
  avatarUrl?: string;
  isFollowing?: boolean;
  onFollowToggle?: (userId: string) => void;
}

const UserItem = ({
  id,
  username,
  avatarUrl,
  isFollowing,
  onFollowToggle,
}: Props) => {
  return (
    <ListItem sx={{ px: 0 }}>
      <ListItemAvatar>
        <Link to={`/profile/${id}`} style={{ textDecoration: "none" }}>
          <Avatar src={avatarUrl} sx={{ cursor: "pointer" }}>
            {username[0].toUpperCase()}
          </Avatar>
        </Link>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            to={`/profile/${id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {username}
            </Typography>
          </Link>
        }
      />
      {onFollowToggle && (
        <Button
          variant={isFollowing ? "outlined" : "contained"}
          size="small"
          onClick={() => onFollowToggle(id)}
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      )}
    </ListItem>
  );
};

export default UserItem;
