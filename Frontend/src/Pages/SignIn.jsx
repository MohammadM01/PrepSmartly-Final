import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { useForm } from "../hooks/useForm";
// import { validateSignInForm } from "../utils/validation";
// import Button from "../components/ui/Button";
// import Alert from "../components/ui/Alert";
// import PageTransition from "../components/layout/PageTransition";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";
import authIllustration from "../assets/Images/auth-illustration-mirror.jpg";
import googleIcon from "../assets/Images/google-icon.svg";

const SignIn = () => {
  const { signIn, signInWithGoogle, authError, clearError, currentUser } = useAuth();
  const navigate = useNavigate();

  // Initialize form with validation
  // Initialize form with validation
  // const {
  //   formData,
  //   errors,
  //   isSubmitting,
  //   handleChange,
  //   handleSubmit,
  //   clearErrors,
  // } = useForm({ email: "", password: "" }, validateSignInForm);

  const [formData, setFormData] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const isSubmitting = false;
  const clearErrors = React.useCallback(() => setErrors({}), []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (fn) => async (e) => {
    e.preventDefault();
    await fn(formData);
  };

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // Clear auth errors when component mounts
  useEffect(() => {
    clearError();
    clearErrors();
  }, [clearError, clearErrors]);

  // Handle form submission
  const onSubmit = async (data) => {
    clearError();

    try {
      const result = await signIn(data.email, data.password);
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleFormSubmit = async (e) => {
    await handleSubmit(onSubmit)(e);
  };

  return (
    // <PageTransition>
    <div>
      <div className="min-h-screen flex bg-[#0A0A0A] overflow-hidden">
        {/* Left Side - Image/Illustration */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/20 to-[#0A0A0A] z-10 mix-blend-overlay"></div>
          <img
            src={authIllustration}
            alt="Authentication Illustration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-20"></div>

          {/* Seamless Blend Gradient - Fades to black on the right edge */}
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-20"></div>

          <div className="absolute bottom-12 left-12 z-30 max-w-lg">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#9333EA]">Interview Skills</span>
            </h2>
            <p className="text-[#94A3B8] text-lg">
              Join thousands of candidates who are acing their dream job interviews with AI-powered preparation.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          {/* Background Elements for Right Side */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#9333EA]/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7E22CE]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          </div>

          <div className="w-full max-w-md relative z-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                  Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#9333EA]">Back</span>
                </h1>
                <p className="text-[#94A3B8] text-lg">
                  Sign in to continue your preparation journey
                </p>
              </div>

              {/* Error and Success Messages */}
              {authError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-6"
                >
                  {/* <Alert message={authError} type="error" onClose={clearError} /> */}
                  <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">{authError}</div>
                </motion.div>
              )}

              {/* Sign In Form */}
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="space-y-5">
                  <div className="relative group">
                    <label className="block text-sm font-medium text-[#E2E8F0] mb-2 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#D8B4FE] transition-colors" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                        autoComplete="email"
                        className={`w-full bg-[#000000]/40 border ${errors.email ? 'border-red-500/50' : 'border-[#9333EA]/20'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] transition-all`}
                      />
                    </div>
                    {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-medium text-[#E2E8F0] mb-2 ml-1">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#D8B4FE] transition-colors" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        required
                        autoComplete="current-password"
                        className={`w-full bg-[#000000]/40 border ${errors.password ? 'border-red-500/50' : 'border-[#9333EA]/20'} rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] transition-all`}
                      />
                    </div>
                    {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#94A3B8] hover:text-[#D8B4FE] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#7E22CE] hover:to-[#581C87] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center space-x-2 text-lg"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#9333EA]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0A0A0A] text-[#94A3B8]">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => signInWithGoogle('signin')}
                  className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 text-lg"
                >
                  <img src={googleIcon} alt="Google" className="w-6 h-6" />
                  <span>Sign in with Google</span>
                </button>
              </form>

              {/* Bottom Navigation */}
              <div className="mt-10 pt-6 border-t border-[#9333EA]/10 text-center">
                <p className="text-[#94A3B8] text-base">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-[#D8B4FE] font-bold hover:text-white transition-colors ml-1"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SignIn;
