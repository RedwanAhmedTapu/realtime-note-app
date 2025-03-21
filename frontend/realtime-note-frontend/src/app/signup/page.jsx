"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react"; 
import useAxios from "@/lib/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const axiosInstance = useAxios();

  // Email validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  
  // Password validation (at least 6 chars, 1 number, 1 special char)
  const validatePassword = (password) =>
    /^(?=.*[0-9])(?=.*[\W_]).{6,}$/.test(password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(formData.email)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters long and contain 1 number & 1 special character");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/auth/signup", formData, { withCredentials: true });

      login(res.data.accessToken);
      router.push("/login");

    } catch (err) {
      if (err.response) {
        // If server responds with an error
        if (err.response.status === 409) {
          setError("User already exists. Try logging in.");
        } else {
          setError(err.response.data.message || "Signup failed");
        }
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-800 to-slate-900">
      <div className="bg-slate-700 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-slate-200 mb-6">Sign Up</h2>
        {error && (
          <p className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-md mb-4">
            {error}
          </p>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 placeholder-slate-400"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 placeholder-slate-400"
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 placeholder-slate-400 pr-12"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-800 text-slate-200 placeholder-slate-400 pr-12"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 hover:underline transition-all"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
