import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Groups from "./pages/Groups";
import "bootstrap/dist/css/bootstrap.min.css";
import favicon1 from "@/assets/shuttle (1).png";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Groups />,
      },
    ],
  },
  {
    path: "/chat/:id",
    element: <Chats />,
  },
]);

function App() {
  const [favicon, setFavicon] = useState(favicon1); // Default favicon

  useEffect(() => {
    const link =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.type = "image/png"; // Adjust type if your image type is different
    link.rel = "shortcut icon";
    link.href = favicon;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, [favicon]);

  const changeFavicon = (icon) => {
    setFavicon(icon);
  };
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
