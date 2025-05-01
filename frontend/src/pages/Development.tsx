// import { useState } from "react";
// import AlertBox from "../components/AlertBox";
import Post from "../components/PostPreview.tsx";

const Development = () => {
  //   const [alertVisibility, setAlertVisibility] = useState(true);
  //   return (
  //     alertVisibility && (
  //       <AlertBox
  //         severity="error"
  //         variant="filled"
  //         onClose={() => setAlertVisibility(false)}
  //       >
  //         Error Creating User Account
  //       </AlertBox>
  //     )
  //   );

  return (
    <Post
      image="/dummies/Post.png"
      alt="Sample Post"
      likes={42}
      postId="abc123"
    />
  );
};

export default Development;
