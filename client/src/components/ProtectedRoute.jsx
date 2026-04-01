const ProtectedRoute = ({ children }) => {
  // Always render the protected page since auth is removed
  return <>{children}</>;
};

export default ProtectedRoute;