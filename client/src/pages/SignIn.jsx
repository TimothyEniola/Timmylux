import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  LogIn,
  CheckCircle,
} from "lucide-react";
import { apiRequest } from "../utils/api";
import useAuthStore from "../store/authStore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState("signin"); // "signin" | "forgot" | "sent"
  const [resetEmail, setResetEmail] = useState("");

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'ADMIN' || user?.role === 'SUPERADMIN' ? '/admin' : '/'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await login(email, password);
      toast.success("Login successful!");

      // Route based on role
      if (
        response.data.role === "ADMIN" ||
        response.data.role === "SUPERADMIN"
      ) {
        navigate("/admin");
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Connect to the backend forgot-password endpoint
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: resetEmail },
      });
      setView("sent");
    } catch (error) {
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Forgot Password Form ──────────────────────────────────────────────────
  if (view === "forgot") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-4">
              <Mail className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Forgot Password
            </h2>
            <p className="text-gray-600 mt-2">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#b8942a] transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setView("signin")}
                className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold hover:text-[#b8942a]"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Email Sent Confirmation ───────────────────────────────────────────────
  if (view === "sent") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-4">
              <CheckCircle className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Check Your Email
            </h2>
            <p className="text-gray-600 mt-2">
              We've sent a password reset link to
            </p>
            <p className="text-gray-900 font-semibold mt-1">{resetEmail}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <button
              onClick={() => setView("forgot")}
              className="w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white transition-colors"
            >
              Resend Reset Link
            </button>

            <button
              onClick={() => setView("signin")}
              className="w-full inline-flex items-center justify-center gap-1 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Sign In Form (default) ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37] rounded-full mb-4">
            <User className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your TimmyLux account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm text-[#D4AF37] font-semibold hover:text-[#b8942a]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] text-white py-3 rounded-lg font-semibold hover:bg-[#b8942a] transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <LogIn size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#D4AF37] font-semibold hover:text-[#b8942a]"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
