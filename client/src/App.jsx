import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const About = lazy(() => import("./pages/About"));
const CustomRequest = lazy(() => import("./pages/CustomRequest"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const UserSettings = lazy(() => import("./pages/UserSettings"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminAddProduct = lazy(() => import("./pages/AdminAddProduct"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D4AF37]"></div>
  </div>
);

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <div className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/custom-request" element={<CustomRequest />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
