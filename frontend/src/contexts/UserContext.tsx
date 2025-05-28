import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from "react";

type User = {
  userId: string;
  username: string;
  email: string;
  profilePicture?: string;
  fullName?: string;
  bio?: string;
  country?: string;
  birthdate?: string;
};

const UserContext = createContext<{
  currentUser: User | null;
  updateUserProfile: (updatedUserData: User) => void;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}>({
  currentUser: null,
  updateUserProfile: () => {},
  setCurrentUser: () => {},
});

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setCurrentUser(undefined);
          localStorage.removeItem("token");
        }

        const userData = await response.json();
        setCurrentUser(userData.user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  const updateUserProfile = (updatedUserData: User) => {
    setCurrentUser((prevUser) => ({ ...prevUser, ...updatedUserData }));
  };

  const contextValue = {
    currentUser: currentUser ?? null,
    updateUserProfile,
    setCurrentUser,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
