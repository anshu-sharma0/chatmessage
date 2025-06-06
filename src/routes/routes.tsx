import { createBrowserRouter } from "react-router-dom";
import Chat from "../components/Chat.tsx";
import PublicRoute from "./publicRoute.tsx";
import PrivateRoute from "./privateRoute.tsx";
import AuthComponent from "../authentication/login.tsx";
import NotFoundPage from "../NotFound.tsx";

const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <Chat />,
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login",
        element: <AuthComponent />,
      },
      {
        path: "*",
        element: <NotFoundPage />
      }
    ],
  },
]);

export default router;
