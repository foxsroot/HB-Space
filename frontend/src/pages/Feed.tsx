import { Box, Typography } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PostDetailDialog from "../components/PostDetailDialog";

// Dummy posts
const dummyHomePosts = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  imageUrl: "/dummies/Post.png",
  username: `user${i + 1}`,
  avatarUrl: "/dummies/Avatar.png",
  likes: Math.floor(Math.random() * 100),
  comments: [
    { id: "c1", username: "alice", text: "Nice post!" },
    { id: "c2", username: "bob", text: ":fire::fire::fire:" },
  ],
}));

const Feed = () => {
  const [selectedPost, setSelectedPost] = useState<
    (typeof dummyHomePosts)[0] | null
  >(null);
  const [open, setOpen] = useState(false);

  const handleOpenPost = (postId: number) => {
    const post = dummyHomePosts.find((p) => p.id === postId);
    if (post) {
      setSelectedPost(post);
      setOpen(true);
    }
  };

  const handleAddComment = (postId: string, text: string) => {
    console.log("Add comment", postId, text);
    // Implement comment persistence logic here if needed
  };

  const handleToggleLike = (postId: string) => {
    console.log("Toggle like", postId);
    // Implement like toggling logic here if needed
  };

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
            image={post.imageUrl}
            username={post.username}
            avatarUrl={post.avatarUrl}
            initialLikes={post.likes}
            initialComments={post.comments.length}
            onCommentClick={() => handleOpenPost(post.id)}
          />
        ))}

        {selectedPost && (
          <PostDetailDialog
            open={open}
            onClose={() => setOpen(false)}
            post={selectedPost}
            onAddComment={handleAddComment}
            onToggleLike={handleToggleLike}
            onFollowToggle={() => console.log("Followed")}
            currentUser={{ username: "user" }} // Pass logged-in user
          />
        )}
      </Box>
    </Box>
  );
};

export default Feed;
