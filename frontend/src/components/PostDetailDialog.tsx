import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";
import UserListDialog from "./UserList";

type Comment = {
  commentId: string;
  userId: string;
  postId: string;
  comment: string;
  created_at: string;
  updated_at: string;
  likesCount: number;
  user: User;
  isLiked?: boolean;
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
  let { currentUser } = useUserContext();

  const [post, setPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userListOpen, setUserListOpen] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [userListTitle, setUserListTitle] = useState("");
  const [userListLoading, setUserListLoading] = useState(false);
  const [editPostMode, setEditPostMode] = useState(false);
  const [editPostCaption, setEditPostCaption] = useState("");

  const handleEditPost = () => {
    setEditPostCaption(post?.caption || "");
    setEditPostMode(true);
    setAnchorEl(null);
  };

  const handleEditPostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/posts/${post.postId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption: editPostCaption }),
      });
      if (response.ok) {
        setPost((prev) =>
          prev ? { ...prev, caption: editPostCaption } : prev
        );
        setEditPostMode(false);
      }
    } catch (e) {
      // Optionally show error
    }
  };

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
              comments: [
                ...prevPost.comments,
                {
                  ...response.comment,
                  likesCount: response.comment.likesCount ?? 0,
                  isLiked: response.comment.isLiked ?? false,
                },
              ],
            }
          : null
      );

      setComment("");
    } catch (e) {
      console.error("Error while adding comment:", e);
    }
  };

  // Like/unlike post
  const handleToggleLike = async () => {
    if (!post) return;
    try {
      const method = isLiked ? "DELETE" : "POST";
      const url = `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/likes`;
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        // Try to get updated isLiked and likesCount from backend if available
        const data = await response.json().catch(() => null);
        if (
          data &&
          typeof data.isLiked !== "undefined" &&
          typeof data.likesCount !== "undefined"
        ) {
          setIsLiked(!!data.isLiked);
          setPost((prev) =>
            prev ? { ...prev, likesCount: data.likesCount } : prev
          );
        } else {
          setIsLiked((prev) => !prev);
          setPost((prev) =>
            prev
              ? {
                  ...prev,
                  likesCount: prev.likesCount + (isLiked ? -1 : 1),
                }
              : prev
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Like/unlike comment
  const handleToggleCommentLike = async (commentId: string, liked: boolean) => {
    try {
      const method = liked ? "DELETE" : "POST";
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/posts/${postId}/comments/${commentId}/like`;
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.commentId === commentId
                ? {
                    ...c,
                    likesCount: c.likesCount + (liked ? -1 : 1),
                    isLiked: !liked,
                  }
                : c
            ),
          };
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Edit comment
  const handleEditComment = async (commentId: string, newComment: string) => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/posts/${postId}/comments/${commentId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      });
      if (response.ok) {
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.map((c) =>
              c.commentId === commentId ? { ...c, comment: newComment } : c
            ),
          };
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/posts/${postId}/comments/${commentId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setPost((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: prev.comments.filter((c) => c.commentId !== commentId),
          };
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Delete post handler
  const handleDeletePost = async () => {
    if (!post) return;
    setDeleteLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        setDeleteLoading(false);
        onClose();
      } else {
        setDeleteLoading(false);
        // Optionally show error
      }
    } catch (e) {
      setDeleteLoading(false);
      // Optionally show error
    }
  };

  // Fetch post details
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

      setPost(postData);
      setIsLiked(!!postData.isLiked);
      setIsFollowing(postData.isFollowing);
    };

    fetchData();
  }, [postId]);

  const handleFollowToggle = async () => {
    if (!post || !currentUser) return;
    const isSelf = post.user.userId === currentUser.userId;
    if (isSelf) return;
    if (isFollowing === null) return; // Prevent click if state is unknown
    const method = isFollowing ? "DELETE" : "POST";
    const url = `${import.meta.env.VITE_API_BASE_URL}/user/${
      post.user.userId
    }/followers`;
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        setIsFollowing((prev) => !prev);
      }
    } catch (e) {
      // Optionally show error
    }
  };

  // Handler to open user list for post likes
  const handleOpenPostLikes = async () => {
    if (!post) return;
    setUserListTitle("Likes");
    setUserListOpen(true);
    setUserListLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${post.postId}/likes`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setUserList(
          (data.likedBy || []).map((u: any) => ({
            id: u.userId,
            username: u.username,
            avatarUrl: u.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  u.profilePicture
                }`
              : undefined,
            isFollowing: u.isFollowing,
          }))
        );
      } else {
        setUserList([]);
      }
    } catch {
      setUserList([]);
    }
    setUserListLoading(false);
  };

  // Handler to open user list for comment likes
  const handleOpenCommentLikes = async (commentId: string) => {
    setUserListTitle("Likes");
    setUserListOpen(true);
    setUserListLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/posts/${postId}/comments/${commentId}/like`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.ok) {
        const data = await res.json();

        setUserList(
          (data.likes || []).map((like: any) => ({
            id: like.userId,
            username: like.username,
            avatarUrl: like.profilePicture
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  like.profilePicture
                }`
              : undefined,
            isFollowing: like.isFollowing,
          }))
        );
      } else {
        setUserList([]);
      }
    } catch {
      setUserList([]);
    }
    setUserListLoading(false);
  };

  return (
    <>
      {post && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: "transparent",
              boxShadow: "none",
              borderRadius: 0,
            },
          }}
        >
          <DialogContent
            sx={{
              p: 0,
              display: "flex",
              height: { xs: 500, md: 600 },
              background: "transparent",
              borderRadius: 0,
              boxShadow: "none",
              overflow: "visible",
              border: "none",
            }}
          >
            <Box
              flex={3}
              sx={{
                bgcolor: "#121212",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: "4 / 5",
                minHeight: "100%",
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                overflow: "hidden",
                border: "none",
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
                  objectFit: "cover",
                  borderRadius: 0,
                }}
              />
            </Box>
            <Box
              flex={2}
              display="flex"
              flexDirection="column"
              position="relative"
              bgcolor="#181818"
              minWidth={320}
              sx={{
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                border: "none",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
                py={1}
                sx={{ borderBottom: "1px solid #222" }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <MuiLink
                    component={Link}
                    to={`/${post.user.username}`}
                    underline="none"
                  >
                    <Avatar
                      src={
                        post.user.profilePicture
                          ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                              post.user.profilePicture
                            }`
                          : "/dummies/Avatar.png"
                      }
                      sx={{ mr: 1, width: 36, height: 36 }}
                    >
                      {post.user.username[0]?.toUpperCase()}
                    </Avatar>
                  </MuiLink>
                </Box>
                <MuiLink
                  component={Link}
                  to={`/${post.user.username}`}
                  color="white"
                  underline="hover"
                >
                  <Typography
                    variant="subtitle2"
                    color="white"
                    fontWeight="bold"
                  >
                    {post.user.username}
                  </Typography>
                </MuiLink>
                {/* Show menu only if current user is the post owner */}
                {currentUser && post.user.userId === currentUser.userId && (
                  <>
                    <IconButton
                      aria-label="more"
                      onClick={(e) => setAnchorEl(e.currentTarget)}
                      size="small"
                      sx={{ color: "white" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      transformOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                      <MenuItem
                        onClick={handleEditPost}
                        sx={{ color: "#e52e71" }}
                      >
                        Edit Post
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          setAnchorEl(null);
                          handleDeletePost();
                        }}
                        disabled={deleteLoading}
                        sx={{ color: "red" }}
                      >
                        Delete Post
                      </MenuItem>
                    </Menu>
                  </>
                )}
                {/* Follow/Unfollow button (not for self) */}
                {currentUser && post.user.userId !== currentUser.userId && (
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    size="small"
                    sx={{
                      ml: 2,
                      color: isFollowing ? "#e52e71" : "white",
                      background: isFollowing ? "transparent" : "#e52e71",
                      borderColor: "#e52e71",
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 100,
                    }}
                    onClick={handleFollowToggle}
                    disabled={isFollowing === null}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                )}
                <IconButton onClick={onClose} sx={{ color: "white" }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box flex={1} overflow="auto" px={2} py={1}>
                {/* Post caption section */}
                <Box display="flex" alignItems="flex-start" mb={2} gap={1.5}>
                  <MuiLink
                    component={Link}
                    to={`/${post.user.username}`}
                    underline="none"
                  >
                    <Avatar
                      src={
                        post.user.profilePicture
                          ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                              post.user.profilePicture
                            }`
                          : "/dummies/Avatar.png"
                      }
                      sx={{ width: 32, height: 32, mr: 1 }}
                    >
                      {post.user.username[0]?.toUpperCase()}
                    </Avatar>
                  </MuiLink>
                  <Box flex={1}>
                    <Typography variant="body2" color="white" sx={{ mb: 0.5 }}>
                      <MuiLink
                        component={Link}
                        to={`/${post.user.username}`}
                        underline="hover"
                        color="white"
                        fontWeight="bold"
                      >
                        {post.user.username}
                      </MuiLink>{" "}
                      {post.caption}
                    </Typography>
                    <Typography variant="caption" color="#aaa">
                      {post.created_at
                        ? getRelativeTime(post.created_at)
                        : "Just now"}
                    </Typography>
                  </Box>
                </Box>
                {/* Comments section */}
                {post.comments.length === 0 && (
                  <Typography
                    variant="body2"
                    color="#aaa"
                    textAlign="center"
                    mt={2}
                  >
                    No comments yet. Be the first to comment!
                  </Typography>
                )}
                {post.comments.map((c) => (
                  <Box
                    key={c.commentId}
                    display="flex"
                    alignItems="flex-start"
                    mb={2}
                    gap={1.5}
                  >
                    <MuiLink
                      component={Link}
                      to={`/${c.user.username}`}
                      underline="none"
                    >
                      <Avatar
                        src={
                          c.user.profilePicture
                            ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                                c.user.profilePicture
                              }`
                            : "/dummies/Avatar.png"
                        }
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {c.user.username[0]?.toUpperCase()}
                      </Avatar>
                    </MuiLink>
                    <Box flex={1}>
                      <Typography variant="body2" color="white">
                        <MuiLink
                          component={Link}
                          to={`/${c.user.username}`}
                          underline="hover"
                          color="white"
                          fontWeight="bold"
                        >
                          {c.user.username}
                        </MuiLink>{" "}
                        {c.comment}
                      </Typography>
                      <Typography variant="caption" color="#aaa">
                        {c.created_at
                          ? getRelativeTime(c.created_at)
                          : "Just now"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        {/* Like button for any user */}
                        <IconButton
                          size="small"
                          sx={{ color: c.isLiked ? "#e52e71" : "white" }}
                          onClick={() =>
                            handleToggleCommentLike(c.commentId, !!c.isLiked)
                          }
                        >
                          {c.isLiked ? (
                            <FavoriteIcon fontSize="small" />
                          ) : (
                            <FavoriteBorderIcon fontSize="small" />
                          )}
                        </IconButton>
                        <Typography
                          variant="caption"
                          color="white"
                          sx={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleOpenCommentLikes(c.commentId)}
                        >
                          {c.likesCount} {c.likesCount === 1 ? "like" : "likes"}
                        </Typography>
                        {/* Three dots menu for edit/delete */}
                        <CommentMenu
                          comment={c}
                          post={post}
                          currentUser={currentUser as any}
                          onEdit={handleEditComment}
                          onDelete={handleDeleteComment}
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ borderColor: "#222" }} />
              <Box px={2} py={1} display="flex" alignItems="center" gap={1}>
                <IconButton
                  onClick={handleToggleLike}
                  sx={{ color: isLiked ? "#e52e71" : "white" }}
                >
                  {isLiked ? (
                    <FavoriteIcon color="error" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleOpenPostLikes}
                >
                  {post.likesCount} {post.likesCount === 1 ? "like" : "likes"}
                </Typography>
              </Box>
              {editPostMode && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 60,
                    left: 0,
                    right: 0,
                    maxWidth: "100%",
                    bgcolor: "#181818",
                    zIndex: 20,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 8,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                  component="form"
                  onSubmit={handleEditPostSubmit}
                >
                  <Typography variant="h6" color="white" mb={1}>
                    Edit Caption
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    value={editPostCaption}
                    onChange={(e) => setEditPostCaption(e.target.value)}
                    variant="outlined"
                    sx={{
                      backgroundColor: "#222",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        borderColor: "#333",
                        "& fieldset": { borderColor: "#333" },
                        "&:hover fieldset": { borderColor: "#e52e71" },
                        "&.Mui-focused fieldset": { borderColor: "#e52e71" },
                      },
                      "& .MuiInputBase-input": { color: "#fff" },
                    }}
                  />
                  <Box display="flex" gap={2} mt={1}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#e52e71",
                        color: "#fff",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                        borderRadius: 2,
                        boxShadow: "none",
                      }}
                      disabled={!editPostCaption.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#fff",
                        borderColor: "#333",
                        background: "#222",
                        px: 3,
                        borderRadius: 2,
                      }}
                      onClick={() => setEditPostMode(false)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              )}
              <Box
                px={2}
                py={1}
                display="flex"
                gap={1}
                alignItems="center"
                component="form"
                onSubmit={handleAddComment}
                sx={{ borderTop: "1px solid #222" }}
              >
                {currentUser && (
                  <Avatar
                    src={
                      currentUser.profilePicture
                        ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                            currentUser.profilePicture
                          }`
                        : "/dummies/Avatar.png"
                    }
                    sx={{ width: 32, height: 32, mr: 1 }}
                  >
                    {currentUser.username[0]?.toUpperCase()}
                  </Avatar>
                )}
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
                      borderColor: "#333",
                      background: "#232323",
                      borderRadius: 8,
                    },
                  }}
                  sx={{
                    input: { color: "white" },
                  }}
                />
                <Button
                  type="submit"
                  disabled={!comment.trim()}
                  sx={{
                    color: "white",
                    backgroundColor: "#e52e71",
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    boxShadow: 1,
                    textTransform: "none",
                  }}
                >
                  Post
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      <UserListDialog
        open={userListOpen}
        onClose={() => setUserListOpen(false)}
        users={userList}
        title={
          userListLoading ? `${userListTitle} (Loading...)` : userListTitle
        }
        currentUserId={currentUser?.userId}
      />
    </>
  );
};

// Fix CommentMenu prop types to accept currentUser as User | null (with profilePicture optional)
type CommentMenuUser = {
  userId: string;
  username: string;
  profilePicture?: string;
  fullName?: string;
} | null;

const CommentMenu = ({
  comment,
  post,
  currentUser,
  onEdit,
  onDelete,
}: {
  comment: Comment;
  post: Post;
  currentUser: CommentMenuUser;
  onEdit: (commentId: string, newComment: string) => void;
  onDelete: (commentId: string) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);
  const menuOpen = Boolean(anchorEl);
  // Fix: compare to comment.user.userId and post.user.userId
  const isCommentOwner =
    currentUser && currentUser.userId === comment.user.userId;
  const isPostOwner = currentUser && currentUser.userId === post.user.userId;
  const canEdit = isCommentOwner;
  const canDelete = isCommentOwner || isPostOwner;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setEditMode(false);
    setEditValue(comment.comment);
  };
  const handleDelete = () => {
    handleMenuClose();
    onDelete(comment.commentId);
  };
  const handleEdit = () => {
    setEditMode(true);
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(comment.commentId, editValue);
    handleMenuClose();
  };

  if (!canEdit && !canDelete) return null;
  return (
    <>
      <IconButton
        size="small"
        onClick={handleMenuClick}
        sx={{ color: "white" }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {canEdit && !editMode && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
        {canDelete && !editMode && (
          <MenuItem onClick={handleDelete} sx={{ color: "red" }}>
            Delete
          </MenuItem>
        )}
        {editMode && (
          <Box
            component="form"
            onSubmit={handleEditSubmit}
            sx={{ p: 1, display: "flex", flexDirection: "column", gap: 1 }}
          >
            <TextField
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              size="small"
              autoFocus
              multiline
              minRows={1}
              maxRows={4}
            />
            <Box display="flex" gap={1} mt={1}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                disabled={!editValue.trim()}
              >
                Save
              </Button>
              <Button onClick={handleMenuClose} size="small" color="inherit">
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default PostDetailDialog;
