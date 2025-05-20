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
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserList from "./UserList.tsx";
import { ReactFormState } from "react-dom/client";

type Comment = {
  commentId: string;
  userId: string;
  postId: string;
  comment: string;
  created_at: string;
  updated_at: string;
  likesCount: number;
  user: User;
};

interface User {
  userId: string;
  username: string;
  profilePicture: string;
  fullName: string;
}

type Post = {
  postId: string;
  image: string;
  caption: string;
  userId: string;
  created_at: string;
  updated_at: string;
  likesCount: number;
  user: User;
  comments: Comment[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  postId: string;
}

const PostDetailDialog = ({ open, onClose, postId }: Props) => {
  // const [likesDialogOpen, setLikesDialogOpen] = React.useState(false);
  // const [isLiked, setIsLiked] = React.useState(!!post.isLiked);
  // const [likeCount, setLikeCount] = React.useState(post.likeCount ?? 0);
  // const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(
  //   null
  // );
  // const [selectedComment, setSelectedComment] = React.useState<Comment | null>(
  //   null
  // );

  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  function getRelativeTime(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    if (minutes < 1) return `just now`;
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  }

  const handleAddComment = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (!trimmed) return;

    try {
      const postComment = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: `${comment}`,
          }),
        }
      );

      const response = await postComment.json();

      if (response.error) {
        return;
      }

      setPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              comments: [...prevPost.comments, response.comment],
            }
          : null
      );

      setComment("");
    } catch (e) {
      console.error("Error while adding comment:", e);
    }
  };

  const handleToggleLike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/likes`,
        {
          method: "POST",
        }
      );

      const postLike = await response.json();

      if (postLike.error) {
        return;
      }

      setIsLiked((prev) => !prev);
    } catch (e) {
      console.log(e);
    }
  };

  // const handleToggleCommentLike = (commentId: string) => {
  //   setComments((prev) =>
  //     prev.map((comment) =>
  //       comment.id === commentId
  //         ? {
  //             ...comment,
  //             isLiked: !comment.isLiked,
  //             likeCount: comment.isLiked
  //               ? comment.likeCount - 1
  //               : comment.likeCount + 1,
  //           }
  //         : comment
  //     )
  //   );
  //   onToggleCommentLike?.(commentId);
  // };

  // const handleMenuOpen = (
  //   event: React.MouseEvent<HTMLElement>,
  //   comment: Comment
  // ) => {
  //   setMenuAnchorEl(event.currentTarget);
  //   setSelectedComment(comment);
  // };

  // const handleMenuClose = () => {
  //   setMenuAnchorEl(null);
  //   setSelectedComment(null);
  // };

  // const handleDeleteComment = () => {
  //   if (selectedComment) {
  //     setComments((prev) => prev.filter((c) => c.id !== selectedComment.id));
  //     // TODO: Call backend delete here
  //   }
  //   handleMenuClose();
  // };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const postData = await data.json();

      if (postData.error) {
        onClose();
      }

      console.log(postData);
      setPost(postData);
    };

    fetchData();
  }, [postId]);

  return (
    <>
      {
        post && (
          <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent sx={{ p: 0, display: "flex", height: 600 }}>
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
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                    post.image
                  }`}
                  alt="post"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>

              <Box
                flex={2}
                display="flex"
                flexDirection="column"
                position="relative"
                bgcolor="#121212"
              >
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
                      to={`/user/${post.user.username}`}
                      underline="none"
                    >
                      <Avatar
                        src={`${import.meta.env.VITE_BASE_URL}/uploads/${
                          post.user.profilePicture
                        }`}
                        sx={{ mr: 1 }}
                      >
                        {post.user.username}
                      </Avatar>
                    </MuiLink>
                    <MuiLink
                      component={Link}
                      to={`/user/${post.user.username}`}
                      color="white"
                      underline="hover"
                    >
                      <Typography variant="subtitle2" color="white">
                        {post.user.username}
                      </Typography>
                    </MuiLink>
                  </Box>
                  <IconButton onClick={onClose} sx={{ color: "white" }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ borderColor: "white" }} />

                <Box flex={1} overflow="auto" px={2} py={1}>
                  {post.comments.map((c) => (
                    <Box
                      key={c.commentId}
                      display="flex"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <MuiLink
                        component={Link}
                        to={`/user/${c.user.username}`}
                        underline="none"
                      >
                        <Avatar
                          src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                            c.user.profilePicture
                          }`}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {c.userId}
                        </Avatar>
                      </MuiLink>
                      <Box flex={1}>
                        <Typography variant="body2" color="white">
                          <MuiLink
                            component={Link}
                            to={`/user/${c.user.username}`}
                            underline="hover"
                            color="white"
                            fontWeight="bold"
                          >
                            {c.user.username}
                          </MuiLink>{" "}
                          {c.comment}
                        </Typography>

                        {/* <Box display="flex" alignItems="center" gap={1}>
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
                            {c.likesCount}{" "}
                            {c.likesCount === 1 ? "like" : "likes"}
                          </Typography>
                        </Box> */}

                        <Typography variant="caption" color="white">
                          {c.created_at
                            ? getRelativeTime(c.created_at)
                            : "Just now"}
                        </Typography>
                      </Box>
                      {/* {selectedComment?.username === currentUser?.username && (
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, c)}
                      sx={{ color: "white" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )} */}
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ borderColor: "white" }} />

                {/* Handle Post Like*/}
                <Box px={2} py={1} display="flex" alignItems="center" gap={1}>
                  <IconButton
                    onClick={handleToggleLike}
                    sx={{ color: "white" }}
                  >
                    {isLiked ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ cursor: "pointer", color: "white" }}
                    // onClick={() => setLikesDialogOpen(true)}
                  >
                    {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                  </Typography>
                </Box>

                <Box
                  px={2}
                  py={1}
                  display="flex"
                  gap={1}
                  component="form"
                  onSubmit={handleAddComment}
                >
                  <TextField
                    fullWidth
                    placeholder="Add a comment..."
                    variant="outlined"
                    size="small"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                    InputProps={{
                      style: {
                        color: "white",
                        borderColor: "#ccc",
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!comment.trim()}
                    sx={{ color: "black", backgroundColor: "white" }}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </DialogContent>
          </Dialog>
        )

        // <UserList
        //   open={likesDialogOpen}
        //   onClose={() => setLikesDialogOpen(false)}
        //   users={post.likedUsers || []}
        //   onFollowToggle={onFollowToggle}
        //   title="Likes"
        // />

        // <Menu
        //   anchorEl={menuAnchorEl}
        //   open={Boolean(menuAnchorEl)}
        //   onClose={handleMenuClose}
        // >
        //   {selectedComment?.username === currentUser?.username && (
        //     <MenuItem onClick={handleDeleteComment} sx={{ color: "red" }}>
        //       Delete
        //     </MenuItem>
        //   )}
        // </Menu>
      }
    </>
  );
};

export default PostDetailDialog;
