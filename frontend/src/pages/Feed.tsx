import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PostDetailDialog from "../components/PostDetailDialog";
import Loading from "../components/Loading";

const Feed = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.posts) {
          setPosts(data.posts);
        } else {
          setError(data.message || "Failed to fetch posts");
        }
      } catch (e) {
        setError("Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleOpenPost = (postId: string) => {
    const post = posts.find((p) => p.postId?.toString() === postId.toString());
    if (post) {
      setSelectedPost(post);
      setOpen(true);
    }
  };

  return (
    <Box
      display="flex"
      sx={{
        background: "#000", // solid black background
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Box
        flex={1}
        sx={{
          ml: { xs: 0, md: "275px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          width: "100%",
          p: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 4,
            pb: 4,
            minHeight: "100vh",
            background: "rgba(255,255,255,0.04)",
          }}
        >
          {loading && <Loading />}
          {error && <Typography color="error">{error}</Typography>}
          {!loading && !error && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              {posts.map((post) => (
                <PostCard
                  key={post.postId}
                  postId={post.postId?.toString()}
                  image={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                    post.image
                  }`}
                  username={post.user?.username || ""}
                  avatarUrl={
                    post.user?.profilePicture
                      ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${
                          post.user.profilePicture
                        }`
                      : "/dummies/Avatar.png"
                  }
                  caption={post.caption}
                  initialLikes={post.likesCount || 0}
                  initialComments={post.commentsCount || 0}
                  onCommentClick={() => handleOpenPost(post.postId)}
                />
              ))}
            </Box>
          )}
          {selectedPost && (
            <PostDetailDialog
              open={open}
              onClose={() => setOpen(false)}
              postId={selectedPost.postId?.toString()}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Feed;
