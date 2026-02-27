import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 🔐 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 👑 Admin route check
  if (role === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;