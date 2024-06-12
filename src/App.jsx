import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Chats from "./pages/Chats";
import Groups from "./pages/Groups";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <Groups />,
      },
      {
        path: "/chat",
        element: <Chats />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
