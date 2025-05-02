import { useState } from "react";
import { Button } from "@mui/material";
import UserList from "../components/UserList";

const Development = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: "1", username: "user1", isFollowing: false },
    { id: "2", username: "user2", isFollowing: true },
    { id: "3", username: "user3", isFollowing: false },
    { id: "4", username: "user1", isFollowing: false },
    { id: "5", username: "user2", isFollowing: true },
    { id: "6", username: "user3", isFollowing: false },
    { id: "7", username: "user1", isFollowing: false },
    { id: "8", username: "user2", isFollowing: true },
    { id: "9", username: "user3", isFollowing: false },
  ]);

  const handleFollowToggle = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Show Users
      </Button>
      <UserList
        open={open}
        onClose={() => setOpen(false)}
        users={users}
        onFollowToggle={handleFollowToggle}
      />
    </div>
  );
};

export default Development;
