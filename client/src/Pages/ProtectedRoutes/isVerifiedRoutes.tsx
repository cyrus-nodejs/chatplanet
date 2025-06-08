import { Navigate } from "react-router-dom";
import {  getAuthSuccess, getIsAuthenticated } from "../../Redux/features/auth/authSlice";
import { useAppSelector } from "../../Redux/app/hook";

const IsVerifiedRoute = ({ children }:{ children: React.ReactNode }) => {
   // Verify user authentication
     const success = useAppSelector(getAuthSuccess)
     const isAuthenticated = useAppSelector(getIsAuthenticated)

  return success && isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default  IsVerifiedRoute;