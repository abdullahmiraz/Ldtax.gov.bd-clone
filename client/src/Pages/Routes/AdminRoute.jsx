import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import { useEffect, useState } from "react"; // Import useEffect and useState

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false); // State to indicate whether authentication and admin status checks are complete

  useEffect(() => {
    if (!loading && !isAdminLoading) {
      setIsReady(true); // Set isReady to true once authentication and admin status checks are complete
    }
  }, [loading, isAdminLoading]); // Dependency array to watch for changes in loading and isAdminLoading

  if (!isReady) {
    return <progress className="progress w-56"></progress>;
  }

  if (user && isAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;
