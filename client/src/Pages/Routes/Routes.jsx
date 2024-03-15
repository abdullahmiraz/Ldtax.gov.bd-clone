import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import AdminPanel from "../AdminPanel/AdminPanel";
import Dashboard from "../Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "adminpanel",
    element: <AdminPanel />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "updatedPDF/:pdfId",
    element: <App />,
  },
]);
