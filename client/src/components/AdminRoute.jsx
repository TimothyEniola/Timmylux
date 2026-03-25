import { Outlet } from 'react-router-dom';

const AdminRoute = () => {
  // Always render since auth is removed
  return <Outlet />;
};

export default AdminRoute;