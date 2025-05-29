import {
  Card,
  Avatar,
  CardMedia,
  CardContent,
  IconButton,
  Typography,
  Box,
  Link as MuiLink,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  image: string;
  username: string;
  avatarUrl: string;
  postId: string;
  initialLikes: number;
  initialComments: number;
  isLiked?: boolean;
  caption?: string;
  userId: string;
  onCommentClick?: () => void;
}

const PostCard = ({
  image,
  username,
  avatarUrl,
  postId,
  initialLikes,
  initialComments,
  isLiked = false,
  caption,
  userId,
  onCommentClick,
}: Props) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    const method = liked ? "DELETE" : "POST";
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/likes`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setLiked((prev) => !prev);
        setLikes((prev) => prev + (liked ? -1 : 1));
      }
    } catch (e) {
      // Optionally show error
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userId}/followers`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        handleMenuClose();
        // Optionally update UI or notify parent
        setLiked(false); // Optionally reset like state if needed
        // Optionally trigger a callback or state update
      } else {
        handleMenuClose();
        alert("Failed to unfollow user.");
      }
    } catch (e) {
      handleMenuClose();
      alert("Failed to unfollow user.");
    }
  };

  return (
    <Card
      sx={{
        width: 480,
        height: 750,
        mb: 4,
        backgroundColor: "#121212",
        color: "white",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
          px: 2,
          py: 1,
          position: "relative",
        }}
      >
        <Link to={`/${username}`}>
          <Avatar
            src={avatarUrl}
            sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
          />
        </Link>
        <MuiLink
          component={Link}
          to={`/${username}`}
          color="inherit"
          underline="none"
          sx={{ fontWeight: "bold", fontSize: 14 }}
        >
          {username}
        </MuiLink>
        <Box sx={{ flex: 1 }} />
        <IconButton
          aria-label="more"
          aria-controls={`post-menu-${postId}`}
          aria-haspopup="true"
          onClick={handleMenuClick}
          sx={{ color: "white" }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id={`post-menu-${postId}`}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleUnfollow} sx={{ color: "red" }}>
            Unfollow
          </MenuItem>
        </Menu>
      </Box>

      <CardMedia
        component="img"
        image={image}
        alt="Post"
        sx={{
          width: 480,
          height: 600,
          objectFit: "cover",
        }}
      />

      <CardContent sx={{ px: 2, pt: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={handleLike}
            sx={{ color: liked ? "red" : "white", p: 0.5 }}
          >
            <FavoriteIcon />
          </IconButton>
          <Typography variant="body2">{likes}</Typography>

          <IconButton onClick={onCommentClick} sx={{ color: "white", p: 0.5 }}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">{initialComments}</Typography>
        </Box>

        {caption && (
          <Typography
            variant="body2"
            sx={{ color: "#fff", mt: 1, wordBreak: "break-word" }}
          >
            {caption.length > 200
              ? caption.substring(0, 100) + "...."
              : caption}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
