import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid } from "@mui/material";
import PostPreview from "../components/PostPreview";
import Navbar from "../components/Navbar.tsx";

const allDummyPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  image: "/dummies/Post.png",
  likes: Math.floor(Math.random() * 100),
}));

const POSTS_PER_LOAD = 25;

function Explore() {
  const sortedPosts = allDummyPosts.sort((a, b) => b.likes - a.likes);
  const [visiblePosts, setVisiblePosts] = useState(
    sortedPosts.slice(0, POSTS_PER_LOAD)
  );
  const [loadedCount, setLoadedCount] = useState(POSTS_PER_LOAD);
  const [loading, setLoading] = useState(false);

  const loadMorePosts = () => {
    if (loading || loadedCount >= sortedPosts.length) return;

    setLoading(true);

    setTimeout(() => {
      const nextPosts = sortedPosts.slice(
        loadedCount,
        loadedCount + POSTS_PER_LOAD
      );
      setVisiblePosts((prev) => [...prev, ...nextPosts]);
      setLoadedCount((prev) => prev + POSTS_PER_LOAD);
      setLoading(false);
    }, 300); // simulate loading delay
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      loadMorePosts();
    }
  }, [loadedCount, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Box
      display="flex"
      minHeight="100vh"
      sx={{ backgroundColor: "#000", color: "white" }}
    >
      <Navbar />

      <Box flex={1} sx={{ ml: "275px", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Explore
        </Typography>

        <Grid container spacing={2}>
          {visiblePosts.map((post) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={post.id}>
              <PostPreview
                image={post.image}
                likes={post.likes}
                postId={post.id.toString()}
              />
            </Grid>
          ))}
        </Grid>

        {loading && (
          <Typography align="center" mt={4}>
            Loading more posts...
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default Explore;
