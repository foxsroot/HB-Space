import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Typography from "@mui/material/Typography";
import { useState } from "react";

interface Props {
  image: string;
  alt?: string;
  likes: number;
  postId: string;
  onClick?: () => void;
}

const PostPreview = ({ image, alt = "Post", likes, onClick }: Props) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(likes);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLiking = !liked;
    setLiked(isLiking);
    setTotalLikes((prev) => prev + (isLiking ? 1 : -1));
  };

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{ position: "relative", width: 216, height: 270 }}
      onClick={onClick}
    >
      <CardActionArea>
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <CardMedia
            component="img"
            image={image}
            alt={alt}
            sx={{
              width: "216px",
              height: "270px",
              objectFit: "cover",
            }}
          />

          {hovered && (
            <>
              <IconButton
                onClick={handleLike}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: liked ? "red" : "white",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.7)",
                  },
                }}
              >
                <FavoriteIcon fontSize="large" />
              </IconButton>

              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  bottom: 8,
                  left: 8,
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  px: 1,
                  borderRadius: "4px",
                  fontWeight: 500,
                }}
              >
                {totalLikes} {totalLikes === 1 ? "like" : "likes"}
              </Typography>
            </>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default PostPreview;
