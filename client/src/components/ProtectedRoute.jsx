import { Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Always render the protected page since auth is removed
  return <Outlet />;
};

export default ProtectedRoute;