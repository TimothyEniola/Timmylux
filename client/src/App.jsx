import React, { lazy, Suspense, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TopBar from "./components/TopBar";
import ErrorPage from "./pages/Error";
import Loader from "./components/loader";

const NotFound = lazy(() => import("./pages/NotFound"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
import Navbar from "./components/Navbar";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const CustomRequest = lazy(() => import("./pages/CustomRequest"));
const Help = lazy(() => import("./pages/Help"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminAddProduct = lazy(() => import("./pages/AdminAddProduct"));
const AdminEditProduct = lazy(() => import("./pages/AdminEditProduct"));
const AdminCollections = lazy(() => import("./pages/AdminCollections"));
const AdminFeatured = lazy(() => import("./pages/AdminFeatured"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications"));
const AdminContentEditor = lazy(() => import("./pages/AdminContentEditor"));
const AdminEvents = lazy(() => import("./pages/AdminEvents"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminCoupons = lazy(() => import("./pages/AdminCoupons"));
const AdminProfile = lazy(() => import("./pages/AdminProfile"));
const Academy = lazy(() => import("./pages/Academy"));
const AdminAcademy = lazy(() => import("./pages/AdminAcademy"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Gallery = lazy(() => import("./pages/Gallery"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App caught an error:", error, info);
  }

  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} resetErrorBoundary={this.resetError} />;
    }
    return this.props.children;
  }
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <TopBar collapsed={sidebarCollapsed} />}
      {isAdminRoute && <AdminTopBar collapsed={sidebarCollapsed} />}
      {isAdminRoute ? <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} /> : <Navbar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />}
      <div className={`flex-grow transition-all duration-300 ${sidebarCollapsed ? 'xl:ml-16' : 'xl:ml-64'}`}>
        <AppErrorBoundary>
          <Suspense fallback={<Loader text="Loading page..." />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><UserSettings /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
          <Route path="/custom-request" element={<CustomRequest />} />
          <Route path="/help" element={<Help />} />
          <Route path="/academy" element={<Academy />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/content" element={<AdminRoute><AdminContentEditor /></AdminRoute>} />
          <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
          <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/add-product" element={<AdminRoute><AdminAddProduct /></AdminRoute>} />
          <Route path="/admin/edit-product/:id" element={<AdminRoute><AdminEditProduct /></AdminRoute>} />
          <Route path="/admin/collections" element={<AdminRoute><AdminCollections /></AdminRoute>} />
          <Route path="/admin/featured" element={<AdminRoute><AdminFeatured /></AdminRoute>} />
          <Route path="/admin/profile" element={<AdminRoute><AdminProfile /></AdminRoute>} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/academy" element={<AdminRoute><AdminAcademy /></AdminRoute>} />
          <Route path="/admin/gallery" element={<AdminRoute><AdminGallery /></AdminRoute>} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </AppErrorBoundary>
      </div>
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'xl:ml-16' : 'xl:ml-64'}`}><Footer /></div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}
