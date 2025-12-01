import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import { useForm } from "../hooks/useForm";
// import { validateForgotPasswordForm } from "../utils/validation";
// import AuthLayout from "../components/layout/AuthLayout";
// import FormField from "../components/forms/FormField";
// import FormDivider from "../components/forms/FormDivider";
// import Button from "../components/ui/Button";
// import Alert from "../components/ui/Alert";
import { ArrowRight, Mail } from "lucide-react";

const ForgotPassword = () => {
    const { resetPassword, currentUser } = useAuth();
    const navigate = useNavigate();

    // Mock useForm and validation
    const [formData, setFormData] = useState({ email: "" });
    const [errors, setErrors] = useState({});
    const isSubmitting = false;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const clearErrors = () => setErrors({});
    const setFieldError = (field, message) => setErrors({ ...errors, [field]: message });

    const handleSubmit = (fn) => async (e) => {
        e.preventDefault();
        await fn(formData);
    };

    const [successMessage, setSuccessMessage] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate("/dashboard");
        }
    }, [currentUser, navigate]);

    // Clear errors when component mounts
    useEffect(() => {
        clearErrors();
        setSuccessMessage("");
    }, []);

    // Handle form submission
    const onSubmit = async (data) => {
        setSuccessMessage("");
        clearErrors();

        if (!data.email) {
            setFieldError("email", "Email is required");
            return;
        }

        try {
            const result = await resetPassword(data.email);

            if (result.success) {
                setSuccessMessage(
                    "Password reset email sent! Check your inbox and follow the instructions to reset your password."
                );
                return { success: true };
            } else {
                setFieldError("email", result.message);
                return { success: false };
            }
        } catch (error) {
            console.error("Password reset error:", error);
            setFieldError("email", "An unexpected error occurred. Please try again.");
            return { success: false };
        }
    };

    const handleFormSubmit = async (e) => {
        await handleSubmit(onSubmit)(e);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white">Reset Password</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded">
                        {successMessage}
                    </div>
                )}

                {/* Error Message Generic */}
                {errors.email && !successMessage && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded">
                        {errors.email}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="relative group">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8] group-focus-within:text-[#D8B4FE] transition-colors" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-xl relative block w-full px-3 py-3.5 pl-12 border border-[#9333EA]/20 placeholder-[#94A3B8]/50 text-white bg-[#000000]/40 focus:outline-none focus:ring-[#9333EA] focus:border-[#9333EA] focus:z-10 sm:text-sm"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting || successMessage}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-[#9333EA] to-[#7E22CE] hover:from-[#7E22CE] hover:to-[#581C87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9333EA] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
                        >
                            {successMessage ? "Email Sent" : "Send Reset Email"}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#9333EA]/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#0A0A0A] text-gray-400">Remember your password?</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div>
                            <Link
                                to="/signin"
                                className="w-full inline-flex justify-center py-2 px-4 border border-[#9333EA]/20 rounded-xl shadow-sm bg-[#000000]/40 text-sm font-medium text-gray-300 hover:bg-[#9333EA]/10 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                        <div>
                            <Link
                                to="/signup"
                                className="w-full inline-flex justify-center py-2 px-4 border border-[#9333EA]/20 rounded-xl shadow-sm bg-[#000000]/40 text-sm font-medium text-gray-300 hover:bg-[#9333EA]/10 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
