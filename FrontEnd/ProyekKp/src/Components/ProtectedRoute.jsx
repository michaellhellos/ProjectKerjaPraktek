import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allow }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Jika tidak login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Jika role tidak sesuai yang diizinkan
  if (allow && !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
