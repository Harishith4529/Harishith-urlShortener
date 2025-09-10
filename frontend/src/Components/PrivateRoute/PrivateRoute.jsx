import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom'
import { getToken, removeUser } from '../../redux/slices/User';

const PrivateRoute = () => {

    const dispatch = useDispatch();
    const token = useSelector(getToken);

    if(!token) {
        dispatch(removeUser())
        return <Navigate to={'/login'}/>
    }
    return <Outlet/>
}

export default PrivateRoute