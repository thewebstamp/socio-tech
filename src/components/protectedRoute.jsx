import { useAuthData } from '../context/authContest.jsx';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({children}) {
    const { user } = useAuthData();

    if (!user) {
        return <Navigate to="/welcome" replace />
    }

    return children;
}

export default ProtectedRoute;