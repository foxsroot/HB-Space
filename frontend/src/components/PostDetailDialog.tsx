import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
  Link as MuiLink,
  Menu,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import { Link } from "react-router-dom";
import UserList from "./UserList.tsx";

interface Comment {
  id: string;
  username: string;
  avatarUrl?: string;
  text: string;
  createdAt?: string;
  isLiked?: boolean;
  likeCount: number;
}

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface Post {
  id: string;
  imageUrl: string;
  username: string;
  avatarUrl?: string;
  comments: Comment[];
  isLiked?: boolean;
  likeCount?: number;
  likedUsers?: User[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post;
  onAddComment?: (postId: string, text: string) => void;
  onToggleLike?: (postId: string) => void;
  onToggleCommentLike?: (commentId: string) => void;
  onFollowToggle?: (userId: string) => void;
  currentUser?: { username: string };
}

const PostDetailDialog = ({
  open,
  onClose,
  post,
  onAddComment,
  onToggleLike,
  onToggleCommentLike,
  onFollowToggle,
  currentUser,
}: Props) => {
  const [comment, setComment] = React.useState("");
  const [likesDialogOpen, setLikesDialogOpen] = React.useState(false);
  const [isLiked, setIsLiked] = React.useState(!!post.isLiked);
  const [likeCount, setLikeCount] = React.useState(post.likeCount ?? 0);
  const [comments, setComments] = React.useState<Comment[]>(
    post.comments || []
  );
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const [selectedComment, setSelectedComment] = React.useState<Comment | null>(
    null
  );

  const handleAddComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      username: currentUser?.username || "user",
      avatarUrl: "", // Optionally use currentUser.avatarUrl
      text: trimmed,
      createdAt: "Just now",
      likeCount: 0, // New comment starts with no likes
    };

    setComments((prev) => [...prev, newComment]);
    onAddComment?.(post.id, trimmed);
    setComment("");
  };

  const handleToggleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    onToggleLike?.(post.id);
  };

  const handleToggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likeCount: comment.isLiked
                ? comment.likeCount - 1
                : comment.likeCount + 1,
            }
          : comment
      )
    );
    onToggleCommentLike?.(commentId);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    comment: Comment
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedComment(null);
  };

  const handleDeleteComment = () => {
    if (selectedComment) {
      setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
      // TODO: Call backend delete here
    }
    handleMenuClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, display: "flex", height: 600 }}>
          {/* Left: Image */}
          <Box
            flex={3}
            sx={{
              bgcolor: "#121212",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "4 / 5",
              minHeight: "100%",
            }}
          >
            <img
              src={post.imageUrl}
              alt="post"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Right: Comments & Actions */}
          <Box
            flex={2}
            display="flex"
            flexDirection="column"
            position="relative"
            bgcolor="#121212"
          >
            {/* Header */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1}
            >
              <Box display="flex" alignItems="center">
                <MuiLink
                  component={Link}
                  to={`/user/${post.username}`}
                  underline="none"
                >
                  <Avatar src={post.avatarUrl} sx={{ mr: 1 }}>
                    {post.username[0].toUpperCase()}
                  </Avatar>
                </MuiLink>
                <MuiLink
                  component={Link}
                  to={`/user/${post.username}`}
                  color="white"
                  underline="hover"
                >
                  <Typography variant="subtitle2" color="white">
                    {post.username}
                  </Typography>
                </MuiLink>
              </Box>
              <IconButton onClick={onClose} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ borderColor: "white" }} />

            {/* Comments */}
            <Box flex={1} overflow="auto" px={2} py={1}>
              {comments.map((c) => (
                <Box key={c.id} display="flex" alignItems="flex-start" mb={2}>
                  <MuiLink
                    component={Link}
                    to={`/user/${c.username}`}
                    underline="none"
                  >
                    <Avatar
                      src={c.avatarUrl}
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {c.username[0].toUpperCase()}
                    </Avatar>
                  </MuiLink>
                  <Box flex={1}>
                    <Typography variant="body2" color="white">
                      <MuiLink
                        component={Link}
                        to={`/user/${c.username}`}
                        underline="hover"
                        color="white"
                        fontWeight="bold"
                      >
                        {c.username}
                      </MuiLink>{" "}
                      {c.text}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        onClick={() => handleToggleCommentLike(c.id)}
                        sx={{ color: "white" }}
                      >
                        {c.isLiked ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      <Typography variant="caption" color="white">
                        {c.likeCount} {c.likeCount === 1 ? "like" : "likes"}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="white">
                      {c.createdAt || "Just now"}
                    </Typography>
                  </Box>
                  {selectedComment?.username === currentUser?.username && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, c)}
                      sx={{ color: "white" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
            <Divider sx={{ borderColor: "white" }} />

            {/* Actions */}
            <Box px={2} py={1} display="flex" alignItems="center" gap={1}>
              <IconButton onClick={handleToggleLike} sx={{ color: "white" }}>
                {isLiked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: "white" }}
                onClick={() => setLikesDialogOpen(true)}
              >
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </Typography>
            </Box>

            {/* Add Comment */}
            <Box px={2} py={1} display="flex" gap={1}>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                variant="outlined"
                size="small"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                InputProps={{
                  style: {
                    color: "white",
                    borderColor: "#ccc",
                  },
                }}
              />
              <Button
                onClick={handleAddComment}
                disabled={!comment.trim()}
                sx={{ color: "white" }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Likes List Dialog */}
      <UserList
        open={likesDialogOpen}
        onClose={() => setLikesDialogOpen(false)}
        users={post.likedUsers || []}
        onFollowToggle={onFollowToggle}
        title="Likes"
      />

      {/* Comment Options Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedComment?.username === currentUser?.username && (
          <MenuItem onClick={handleDeleteComment} sx={{ color: "red" }}>
            Delete
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default PostDetailDialog;
