import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import AdminPanel from "../AdminPanel/AdminPanel";
import Dashboard from "../Dashboard/Dashboard";
import AdminRoute from "./AdminRoute";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AdminRoute>
      <App />
      // </AdminRoute>
    ),
  },
  {
    path: "adminpanel",
    element: <AdminPanel />,
  },
  {
    path: "dashboard",
    element: (
      // <AdminRoute>
        <Dashboard />
      // </AdminRoute>
    ),
  },
  {
    path: "updatedPDF/:pdfId",
    element: <App />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
]);
