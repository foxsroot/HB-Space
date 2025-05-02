import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";

const dummyHomePosts = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  image: "/dummies/Post.png",
  username: `user${i + 1}`,
  avatarUrl: "/dummies/Avatar.png",
  likes: Math.floor(Math.random() * 100),
  comments: Math.floor(Math.random() * 20),
}));

const Feed = () => {
  return (
    <Box
      display="flex"
      sx={{ backgroundColor: "#000", color: "white", minHeight: "100vh" }}
    >
      <Navbar />
      <Box flex={1} sx={{ ml: "275px", p: 4 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Home
        </Typography>
        {dummyHomePosts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id.toString()}
            image={post.image}
            username={post.username}
            avatarUrl={post.avatarUrl}
            initialLikes={post.likes}
            initialComments={post.comments}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Feed;
