import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const Searchbar = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchbarProps) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      InputProps={{
        sx: { backgroundColor: "#1a1a1a", borderRadius: 2, color: "white" },
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: "white" }} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default Searchbar;
