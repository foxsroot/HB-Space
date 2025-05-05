import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserItem from "./UserItem";

interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  isFollowing?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  users: User[];
  onFollowToggle?: (userId: string) => void;
  title: string;
}

const UserListDialog = ({
  open,
  onClose,
  users,
  onFollowToggle,
  title,
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          maxHeight: 245,
          overflowY: "auto",
          px: 2,
          py: 0,
        }}
      >
        <List>
          {users.map((user) => (
            <UserItem key={user.id} {...user} onFollowToggle={onFollowToggle} />
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default UserListDialog;
