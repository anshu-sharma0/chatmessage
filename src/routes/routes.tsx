import { createBrowserRouter } from "react-router-dom";
import Chat from "../components/Chat.tsx";
import PublicRoute from "./publicRoute.tsx";
import PrivateRoute from "./privateRoute.tsx";
import AuthComponent from "../authentication/login.tsx";

const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Chat />,
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthComponent />,
      },
    ],
  },
]);

export default router;
