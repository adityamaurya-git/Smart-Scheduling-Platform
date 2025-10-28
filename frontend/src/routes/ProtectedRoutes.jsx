import { useSelector } from "react-redux";

export const protectedRoutes = ({children}) =>{

    const {isAuthenticated} = useSelector((state) =>{
        return state.user
    });

    const isLoggedIn = isAuthenticated;

    return isLoggedIn ? children : <Navigate to="/login" />
    
}