import {
  Card,
  CardHeader,
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
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  image: string;
  username: string;
  avatarUrl: string;
  postId: string;
  initialLikes: number;
  initialComments: number;
}

const PostCard = ({
  image,
  username,
  avatarUrl,
  postId,
  initialLikes,
  initialComments,
}: Props) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    const isLiking = !liked;
    setLiked(isLiking);
    setLikes((prev) => prev + (isLiking ? 1 : -1));
  };

  return (
    <Card
      sx={{
        width: 300,
        mb: 4,
        backgroundColor: "#121212",
        color: "white",
        borderRadius: 2,
        overflow: "hidden", // ensures no spacing gaps
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
          px: 2,
          py: 1,
        }}
      >
        <Link to={`/user/${username}`}>
          <Avatar
            src={avatarUrl}
            sx={{ width: 32, height: 32, mr: 1, cursor: "pointer" }}
          />
        </Link>
        <MuiLink
          component={Link}
          to={`/user/${username}`}
          color="inherit"
          underline="none"
          sx={{ fontWeight: "bold", fontSize: 14 }}
        >
          {username}
        </MuiLink>
      </Box>

      <CardMedia
        component="img"
        image={image}
        alt="Post"
        sx={{
          width: 300,
          height: 375,
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
          <IconButton sx={{ color: "white", p: 0.5 }}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          <Typography variant="body2">{initialComments}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
