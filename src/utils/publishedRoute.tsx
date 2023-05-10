import {useAppSelector} from "../redux/hooks"
import {Navigate, useLocation} from "react-router-dom"

interface propsPublishedRoute {
    children: JSX.Element
}

const PublishedRoute = ({children}:propsPublishedRoute) => {
    const login = useAppSelector(state => state.login);
    let location = useLocation();

    if(login.isAuthenticated && login.accessToken) {
        return <Navigate to="/product" state={{ from: location}} replace/>
    }
    return children
};

export default PublishedRoute;