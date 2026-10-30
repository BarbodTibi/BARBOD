import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { isSignedIn } = useAuth();
  const location = useLocation();
  if (!isSignedIn) return <Navigate to="/signin" replace state={{ from: location }} />;
  return children;
}
