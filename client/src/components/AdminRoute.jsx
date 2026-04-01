const AdminRoute = ({ children }) => {
  // Always render since auth is removed
  return <>{children}</>;
};

export default AdminRoute;