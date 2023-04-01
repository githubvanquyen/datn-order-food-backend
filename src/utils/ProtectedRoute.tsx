import {useAppSelector} from "../redux/hooks"
import {Navigate, useLocation} from "react-router-dom"

interface propsProtectedRoute {
    children: JSX.Element
}

const ProtectedRoute = ({children}:propsProtectedRoute) => {
    const login = useAppSelector(state => state.login);
    let location = useLocation();

    if(!login.isAuthenticated && !login.accessToken) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
    return children
};

export default ProtectedRoute;