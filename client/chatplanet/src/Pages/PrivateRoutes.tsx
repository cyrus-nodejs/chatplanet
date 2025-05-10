import { Navigate } from "react-router-dom";
import { getAuthUser, getIsAuthenticated } from "../Redux/features/auth/authSlice";
import { useAppSelector } from "../Redux/app/hook";
const PrivateRoute = ({ children }:{ children: React.ReactNode }) => {
   
     const user = useAppSelector(getAuthUser)
     const isAuthenticated = useAppSelector(getIsAuthenticated)

  return user && isAuthenticated ? children : <Navigate to="/register" replace />;
};

export default PrivateRoute;