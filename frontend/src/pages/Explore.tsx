import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid } from "@mui/material";
import PostPreview from "../components/PostPreview";
import Navbar from "../components/Navbar.tsx";
import Searchbar from "../components/Searchbar";
import PostDetailDialog from "../components/PostDetailDialog.tsx";

interface User {
  userId: string;
  username: string;
  profilePicture: string;
  fullName: string;
}

interface Post {
  postId: string;
  image: string;
  caption: string;
  userId: string;
  created_at: string;
  updated_at: string;
  likesCount: number;
  commentsCount: number;
  user: User;
}

function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  // const [alertActive, setAlertActive] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const allPost = await data.json();
        setPosts(allPost.posts);
      } catch (e) {
        setError(error);
      }
    };

    fetchPosts();
  }, []);

  const handleOpenDialog = (post: Post) => {
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedPost(null);
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{ backgroundColor: "#000", color: "white" }}
    >
      <Navbar />

      <Box flex={1} sx={{ ml: "275px", p: 4 }}>
        <Box mb={2}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Explore
          </Typography>
          <Searchbar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <Grid container spacing={2}>
          {posts.map((post) => (
            <Grid key={post.postId}>
              <PostPreview
                image={`${import.meta.env.VITE_API_BASE_URL}/uploads/${
                  post.image
                }`}
                likes={post.likesCount}
                postId={post.postId.toString()}
                onClick={() => handleOpenDialog(post)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedPost && (
        <PostDetailDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          postId={selectedPost.postId}
        />
      )}

      {/* <AlertBox>{error}</AlertBox> */}
    </Box>
  );
}

export default Explore;
