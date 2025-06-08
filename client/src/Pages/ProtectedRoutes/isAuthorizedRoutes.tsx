import { Navigate } from "react-router-dom";
import { getAuthUser,  getIsAuthorized } from "../../Redux/features/auth/authSlice";
import { useAppSelector } from "../../Redux/app/hook";
const IsAuthorizedRoute = ({ children }:{ children: React.ReactNode }) => {
   // authorize user
     const user = useAppSelector(getAuthUser)
    const isAuthorized = useAppSelector(getIsAuthorized)

  return user &&  isAuthorized ? children : <Navigate to="/login" replace />;
};

export default  IsAuthorizedRoute;