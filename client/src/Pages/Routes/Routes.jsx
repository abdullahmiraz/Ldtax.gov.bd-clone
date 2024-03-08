import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "../../App";
import AdminPanel from "../AdminPanel/AdminPanel";
import Dashboard from "../Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "adminpanel",
    element: <AdminPanel></AdminPanel>,
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
  },
]);
